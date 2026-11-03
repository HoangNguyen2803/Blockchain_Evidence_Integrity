#!/usr/bin/env python3
"""
BEI-2026 - Digital Signature Module

Algorithm: Ed25519
Purpose:
- Generate public/private key pairs.
- Sign digital evidence metadata.
- Verify signatures and evidence integrity.

Private keys must never be committed to Git or shared.
"""

import argparse
import base64
import hashlib
import json
import os
import sys

from datetime import datetime, timezone
from pathlib import Path

from cryptography.exceptions import InvalidSignature
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric.ed25519 import (
    Ed25519PrivateKey,
    Ed25519PublicKey,
)


def canonical_json(data: dict) -> bytes:
    """Serialize JSON deterministically before signing."""
    return json.dumps(
        data,
        sort_keys=True,
        separators=(",", ":"),
        ensure_ascii=False,
    ).encode("utf-8")


def calculate_file_metadata(file_path: Path) -> dict:
    """Calculate evidence metadata using SHA-256."""

    if not file_path.exists():
        raise FileNotFoundError(f"Evidence not found: {file_path}")

    if not file_path.is_file():
        raise ValueError(f"Not a regular file: {file_path}")

    sha256 = hashlib.sha256()
    size_bytes = 0

    with file_path.open("rb") as evidence_file:
        while True:
            chunk = evidence_file.read(1024 * 1024)

            if not chunk:
                break

            sha256.update(chunk)
            size_bytes += len(chunk)

    return {
        "evidence_id": None,
        "file_name": file_path.name,
        "size_bytes": size_bytes,
        "hash_algorithm": "SHA-256",
        "sha256": sha256.hexdigest(),
    }


def generate_keys(private_path: Path, public_path: Path, force: bool):
    """Generate an Ed25519 key pair."""

    if not force and (private_path.exists() or public_path.exists()):
        raise FileExistsError(
            "A key file already exists. Refusing to overwrite it. "
            "Use --force only if replacement is intended."
        )

    private_path.parent.mkdir(parents=True, exist_ok=True)
    public_path.parent.mkdir(parents=True, exist_ok=True)

    private_key = Ed25519PrivateKey.generate()
    public_key = private_key.public_key()

    private_pem = private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption(),
    )

    public_pem = public_key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo,
    )

    private_path.write_bytes(private_pem)
    os.chmod(private_path, 0o600)

    public_path.write_bytes(public_pem)
    os.chmod(public_path, 0o644)

    print(json.dumps({
        "status": "KEYS_GENERATED",
        "algorithm": "Ed25519",
        "private_key": str(private_path),
        "public_key": str(public_path),
        "private_key_permissions": "600",
        "public_key_permissions": "644",
    }, indent=4))


def load_private_key(path: Path) -> Ed25519PrivateKey:
    key = serialization.load_pem_private_key(
        path.read_bytes(),
        password=None,
    )

    if not isinstance(key, Ed25519PrivateKey):
        raise ValueError("The supplied private key is not Ed25519.")

    return key


def load_public_key(path: Path) -> Ed25519PublicKey:
    key = serialization.load_pem_public_key(path.read_bytes())

    if not isinstance(key, Ed25519PublicKey):
        raise ValueError("The supplied public key is not Ed25519.")

    return key


def sign_evidence(
    file_path: Path,
    evidence_id: str,
    private_path: Path,
    output_path: Path,
):
    """Sign canonical evidence metadata."""

    private_key = load_private_key(private_path)

    payload = calculate_file_metadata(file_path)
    payload["evidence_id"] = evidence_id
    payload["signed_at_utc"] = datetime.now(timezone.utc).isoformat()

    message = canonical_json(payload)
    signature = private_key.sign(message)

    public_key = private_key.public_key()
    public_pem = public_key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo,
    )

    manifest = {
        "signature_algorithm": "Ed25519",
        "payload": payload,
        "signature_base64": base64.b64encode(signature).decode("ascii"),
        "public_key_sha256": hashlib.sha256(public_pem).hexdigest(),
    }

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(
        json.dumps(manifest, indent=4, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )

    print(json.dumps({
        "status": "SIGNATURE_CREATED",
        "evidence_id": evidence_id,
        "manifest": str(output_path),
        "sha256": payload["sha256"],
        "signature_algorithm": "Ed25519",
    }, indent=4, ensure_ascii=False))


def verify_evidence(
    file_path: Path,
    manifest_path: Path,
    public_path: Path,
):
    """Verify both evidence metadata and Ed25519 signature."""

    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))

    if manifest.get("signature_algorithm") != "Ed25519":
        raise ValueError("Unsupported signature algorithm.")

    payload = manifest["payload"]
    public_key = load_public_key(public_path)

    public_pem = public_key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo,
    )

    actual_public_fingerprint = hashlib.sha256(public_pem).hexdigest()

    if actual_public_fingerprint != manifest["public_key_sha256"]:
        raise ValueError("Public key fingerprint does not match the manifest.")

    current_metadata = calculate_file_metadata(file_path)

    metadata_matches = (
        current_metadata["file_name"] == payload["file_name"]
        and current_metadata["size_bytes"] == payload["size_bytes"]
        and current_metadata["sha256"] == payload["sha256"]
    )

    signature = base64.b64decode(
        manifest["signature_base64"],
        validate=True,
    )

    try:
        public_key.verify(signature, canonical_json(payload))
        signature_valid = True
    except InvalidSignature:
        signature_valid = False

    evidence_valid = metadata_matches and signature_valid

    result = {
        "evidence_file": str(file_path),
        "evidence_id": payload.get("evidence_id"),
        "metadata_matches": metadata_matches,
        "signature_valid": signature_valid,
        "integrity_verified": evidence_valid,
        "verification_status": (
            "SIGNATURE_VALID" if evidence_valid
            else "SIGNATURE_INVALID"
        ),
    }

    print(json.dumps(result, indent=4, ensure_ascii=False))

    if not evidence_valid:
        sys.exit(1)


def main():
    parser = argparse.ArgumentParser(
        description="BEI-2026 Ed25519 Digital Signature Tool"
    )

    subparsers = parser.add_subparsers(
        dest="command",
        required=True,
    )

    key_parser = subparsers.add_parser(
        "generate-keys",
        help="Generate an Ed25519 key pair.",
    )
    key_parser.add_argument("--private-key", required=True)
    key_parser.add_argument("--public-key", required=True)
    key_parser.add_argument("--force", action="store_true")

    sign_parser = subparsers.add_parser(
        "sign",
        help="Sign evidence metadata.",
    )
    sign_parser.add_argument("file")
    sign_parser.add_argument("--evidence-id", required=True)
    sign_parser.add_argument("--private-key", required=True)
    sign_parser.add_argument("--output", required=True)

    verify_parser = subparsers.add_parser(
        "verify",
        help="Verify evidence and its digital signature.",
    )
    verify_parser.add_argument("file")
    verify_parser.add_argument("--manifest", required=True)
    verify_parser.add_argument("--public-key", required=True)

    args = parser.parse_args()

    try:
        if args.command == "generate-keys":
            generate_keys(
                Path(args.private_key),
                Path(args.public_key),
                args.force,
            )

        elif args.command == "sign":
            sign_evidence(
                Path(args.file),
                args.evidence_id,
                Path(args.private_key),
                Path(args.output),
            )

        elif args.command == "verify":
            verify_evidence(
                Path(args.file),
                Path(args.manifest),
                Path(args.public_key),
            )

    except (
        FileNotFoundError,
        FileExistsError,
        PermissionError,
        ValueError,
        OSError,
        KeyError,
    ) as error:
        print(json.dumps({
            "status": "ERROR",
            "error": str(error),
        }, indent=4, ensure_ascii=False), file=sys.stderr)
        sys.exit(2)


if __name__ == "__main__":
    main()
