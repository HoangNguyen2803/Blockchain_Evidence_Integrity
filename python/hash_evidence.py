#!/usr/bin/env python3
"""
BEI-2026
Digital Evidence SHA-256 Hashing and Verification

Purpose:
- Calculate SHA-256 hashes of digital evidence.
- Verify evidence integrity against a previously recorded hash.
- Read files in chunks to support large evidence files.
- Never modify or delete the original evidence.
"""

import argparse
import hashlib
import hmac
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

CHUNK_SIZE = 1024 * 1024  # 1 MiB


def calculate_sha256(file_path: Path) -> dict:
    """Calculate SHA-256 and file size without loading the whole file."""

    if not file_path.exists():
        raise FileNotFoundError(f"File not found: {file_path}")

    if not file_path.is_file():
        raise ValueError(f"Not a regular file: {file_path}")

    sha256 = hashlib.sha256()
    size_bytes = 0

    with file_path.open("rb") as evidence_file:
        while True:
            chunk = evidence_file.read(CHUNK_SIZE)

            if not chunk:
                break

            sha256.update(chunk)
            size_bytes += len(chunk)

    return {
        "evidence_file": str(file_path),
        "file_name": file_path.name,
        "size_bytes": size_bytes,
        "hash_algorithm": "SHA-256",
        "sha256": sha256.hexdigest(),
        "calculated_at_utc": datetime.now(timezone.utc).isoformat(),
    }


def verify_sha256(file_path: Path, expected_hash: str) -> dict:
    """Verify a file against an expected SHA-256 hash."""

    expected_hash = expected_hash.strip().lower()

    if len(expected_hash) != 64:
        raise ValueError("Expected SHA-256 hash must contain 64 hexadecimal characters.")

    try:
        bytes.fromhex(expected_hash)
    except ValueError as exc:
        raise ValueError("Expected hash contains invalid hexadecimal characters.") from exc

    result = calculate_sha256(file_path)
    actual_hash = result["sha256"]

    is_valid = hmac.compare_digest(actual_hash, expected_hash)

    result["expected_sha256"] = expected_hash
    result["integrity_verified"] = is_valid
    result["verification_status"] = (
        "INTEGRITY_OK" if is_valid else "INTEGRITY_FAILED"
    )

    return result


def main():
    parser = argparse.ArgumentParser(
        description="BEI-2026 Digital Evidence SHA-256 Tool"
    )

    subparsers = parser.add_subparsers(dest="command", required=True)

    hash_parser = subparsers.add_parser(
        "hash",
        help="Calculate SHA-256 hash of an evidence file."
    )
    hash_parser.add_argument("file", help="Path to the evidence file.")

    verify_parser = subparsers.add_parser(
        "verify",
        help="Verify evidence integrity against an expected SHA-256 hash."
    )
    verify_parser.add_argument("file", help="Path to the evidence file.")
    verify_parser.add_argument(
        "--expected",
        required=True,
        help="Previously recorded SHA-256 hash."
    )

    args = parser.parse_args()
    file_path = Path(args.file)

    try:
        if args.command == "hash":
            result = calculate_sha256(file_path)

        else:
            result = verify_sha256(file_path, args.expected)

        print(json.dumps(result, indent=4, ensure_ascii=False))

        if args.command == "verify" and not result["integrity_verified"]:
            sys.exit(1)

    except (FileNotFoundError, PermissionError, ValueError, OSError) as error:
        print(json.dumps({
            "error": str(error),
            "status": "ERROR"
        }, indent=4, ensure_ascii=False), file=sys.stderr)
        sys.exit(2)


if __name__ == "__main__":
    main()
