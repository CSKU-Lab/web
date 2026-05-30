#!/usr/bin/env python3
"""Migrate cms/materials into features."""

import re
import shutil
from pathlib import Path

WEB = Path("/home/imdev/dev/cs-lab/super-app/web")
CMS = WEB / "src/app/(authed)/cms"
FULL = CMS / "(full-height-layout)"
NORMAL = CMS / "(normal-layout)"
TYPING = CMS / "(typing-preview)"
FEAT = WEB / "src/features"

# Map from source dir → dest in features
COPY_MAPS = [
    # materials list columns/hooks
    (FULL / "materials/_columns", "cms/materials/columns"),
    (FULL / "materials/_hooks", "cms/materials/hooks"),

    # material detail components/hooks
    (FULL / "materials/[materialID]/_components", "cms/materials/components"),
    (FULL / "materials/[materialID]/_hooks", "cms/materials/hooks"),

    # material types
    (FULL / "materials/[materialID]/_materialTypes/CodeMaterial/_components/ConfigTab/_schemas",
     "cms/materials/types/CodeMaterial/components/ConfigTab/schemas"),
    (FULL / "materials/[materialID]/_materialTypes/CodeMaterial/_components/ConfigTab",
     "cms/materials/types/CodeMaterial/components/ConfigTab"),
    (FULL / "materials/[materialID]/_materialTypes/CodeMaterial/_components/RunnersTab/_components",
     "cms/materials/types/CodeMaterial/components/RunnersTab/components"),
    (FULL / "materials/[materialID]/_materialTypes/CodeMaterial/_components/RunnersTab/_stores",
     "cms/materials/types/CodeMaterial/components/RunnersTab/stores"),
    (FULL / "materials/[materialID]/_materialTypes/CodeMaterial/_components/RunnersTab/_types",
     "cms/materials/types/CodeMaterial/components/RunnersTab/types"),
    (FULL / "materials/[materialID]/_materialTypes/CodeMaterial/_components/RunnersTab",
     "cms/materials/types/CodeMaterial/components/RunnersTab"),
    (FULL / "materials/[materialID]/_materialTypes/CodeMaterial/_components/DetailSection",
     "cms/materials/types/CodeMaterial/components/DetailSection"),
    (FULL / "materials/[materialID]/_materialTypes/CodeMaterial/_components/FilesTab",
     "cms/materials/types/CodeMaterial/components/FilesTab"),
    (FULL / "materials/[materialID]/_materialTypes/CodeMaterial/_components/SolutionTab",
     "cms/materials/types/CodeMaterial/components/SolutionTab"),
    (FULL / "materials/[materialID]/_materialTypes/CodeMaterial/_components/TestCaseTab",
     "cms/materials/types/CodeMaterial/components/TestCaseTab"),
    (FULL / "materials/[materialID]/_materialTypes/CodeMaterial/_components",
     "cms/materials/types/CodeMaterial/components"),
    (FULL / "materials/[materialID]/_materialTypes/CodeMaterial/_stores",
     "cms/materials/types/CodeMaterial/stores"),
    (FULL / "materials/[materialID]/_materialTypes/CodeMaterial/_types",
     "cms/materials/types/CodeMaterial/types"),
    (FULL / "materials/[materialID]/_materialTypes/DocumentMaterial/_components/DetailSection",
     "cms/materials/types/DocumentMaterial/components/DetailSection"),
    (FULL / "materials/[materialID]/_materialTypes/DocumentMaterial/_components",
     "cms/materials/types/DocumentMaterial/components"),
    (FULL / "materials/[materialID]/_materialTypes/DocumentMaterial/_stores",
     "cms/materials/types/DocumentMaterial/stores"),
    (FULL / "materials/[materialID]/_materialTypes/DocumentMaterial/_types",
     "cms/materials/types/DocumentMaterial/types"),
    (FULL / "materials/[materialID]/_materialTypes/TypingMaterial/_components/DetailSection",
     "cms/materials/types/TypingMaterial/components/DetailSection"),
    (FULL / "materials/[materialID]/_materialTypes/TypingMaterial/_components",
     "cms/materials/types/TypingMaterial/components"),
    (FULL / "materials/[materialID]/_materialTypes/TypingMaterial/_stores",
     "cms/materials/types/TypingMaterial/stores"),

    # new material
    (NORMAL / "materials/new/_components", "cms/materials/components/new"),
    (NORMAL / "materials/new/_schemas", "cms/materials/schemas/new"),

    # typing preview
    (TYPING / "materials/[materialID]/preview/_components", "cms/materials/components/preview"),

    # CMS-level full-height-layout shared components
    (FULL / "_components", "cms/layout/components"),
    (CMS / "_components", "cms/layout/components/nav"),
]

# Old app path prefix → new features path prefix (for absolute import replacement)
ABS_MAP = [
    (
        "~/app/(authed)/cms/(full-height-layout)/materials/[materialID]/_materialTypes/CodeMaterial/_components/ConfigTab/_schemas",
        "~/features/cms/materials/types/CodeMaterial/components/ConfigTab/schemas",
    ),
    (
        "~/app/(authed)/cms/(full-height-layout)/materials/[materialID]/_materialTypes/CodeMaterial/_components/RunnersTab/_components",
        "~/features/cms/materials/types/CodeMaterial/components/RunnersTab/components",
    ),
    (
        "~/app/(authed)/cms/(full-height-layout)/materials/[materialID]/_materialTypes/CodeMaterial/_components/RunnersTab/_stores",
        "~/features/cms/materials/types/CodeMaterial/components/RunnersTab/stores",
    ),
    (
        "~/app/(authed)/cms/(full-height-layout)/materials/[materialID]/_materialTypes/CodeMaterial/_components/RunnersTab/_types",
        "~/features/cms/materials/types/CodeMaterial/components/RunnersTab/types",
    ),
    (
        "~/app/(authed)/cms/(full-height-layout)/materials/[materialID]/_materialTypes/CodeMaterial/_components/RunnersTab",
        "~/features/cms/materials/types/CodeMaterial/components/RunnersTab",
    ),
    (
        "~/app/(authed)/cms/(full-height-layout)/materials/[materialID]/_materialTypes/CodeMaterial/_components/DetailSection",
        "~/features/cms/materials/types/CodeMaterial/components/DetailSection",
    ),
    (
        "~/app/(authed)/cms/(full-height-layout)/materials/[materialID]/_materialTypes/CodeMaterial/_components",
        "~/features/cms/materials/types/CodeMaterial/components",
    ),
    (
        "~/app/(authed)/cms/(full-height-layout)/materials/[materialID]/_materialTypes/CodeMaterial/_stores",
        "~/features/cms/materials/types/CodeMaterial/stores",
    ),
    (
        "~/app/(authed)/cms/(full-height-layout)/materials/[materialID]/_materialTypes/CodeMaterial/_types",
        "~/features/cms/materials/types/CodeMaterial/types",
    ),
    (
        "~/app/(authed)/cms/(full-height-layout)/materials/[materialID]/_materialTypes/CodeMaterial",
        "~/features/cms/materials/types/CodeMaterial",
    ),
    (
        "~/app/(authed)/cms/(full-height-layout)/materials/[materialID]/_materialTypes/DocumentMaterial/_components",
        "~/features/cms/materials/types/DocumentMaterial/components",
    ),
    (
        "~/app/(authed)/cms/(full-height-layout)/materials/[materialID]/_materialTypes/DocumentMaterial/_stores",
        "~/features/cms/materials/types/DocumentMaterial/stores",
    ),
    (
        "~/app/(authed)/cms/(full-height-layout)/materials/[materialID]/_materialTypes/DocumentMaterial/_types",
        "~/features/cms/materials/types/DocumentMaterial/types",
    ),
    (
        "~/app/(authed)/cms/(full-height-layout)/materials/[materialID]/_materialTypes/DocumentMaterial",
        "~/features/cms/materials/types/DocumentMaterial",
    ),
    (
        "~/app/(authed)/cms/(full-height-layout)/materials/[materialID]/_materialTypes/TypingMaterial/_components",
        "~/features/cms/materials/types/TypingMaterial/components",
    ),
    (
        "~/app/(authed)/cms/(full-height-layout)/materials/[materialID]/_materialTypes/TypingMaterial/_stores",
        "~/features/cms/materials/types/TypingMaterial/stores",
    ),
    (
        "~/app/(authed)/cms/(full-height-layout)/materials/[materialID]/_materialTypes/TypingMaterial",
        "~/features/cms/materials/types/TypingMaterial",
    ),
    (
        "~/app/(authed)/cms/(full-height-layout)/materials/[materialID]/_components",
        "~/features/cms/materials/components",
    ),
    (
        "~/app/(authed)/cms/(full-height-layout)/materials/[materialID]/_hooks",
        "~/features/cms/materials/hooks",
    ),
    (
        "~/app/(authed)/cms/(full-height-layout)/materials/_columns",
        "~/features/cms/materials/columns",
    ),
    (
        "~/app/(authed)/cms/(full-height-layout)/materials/_hooks",
        "~/features/cms/materials/hooks",
    ),
]

def copy_files():
    copied = 0
    for src_abs, dest_feat in COPY_MAPS:
        dest_abs = FEAT / dest_feat
        if not src_abs.exists():
            print(f"  SKIP: {src_abs.name}")
            continue
        dest_abs.mkdir(parents=True, exist_ok=True)
        for item in src_abs.rglob("*"):
            if item.is_file():
                rel = item.relative_to(src_abs)
                dest_file = dest_abs / rel
                dest_file.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(item, dest_file)
                copied += 1
    print(f"Copied {copied} files")

def copy_material_type_indexes():
    """Copy the index.tsx files from each material type root."""
    for mat_type in ["CodeMaterial", "DocumentMaterial", "TypingMaterial"]:
        src = FULL / f"materials/[materialID]/_materialTypes/{mat_type}/index.tsx"
        dest = FEAT / f"cms/materials/types/{mat_type}/index.tsx"
        if src.exists():
            dest.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src, dest)
            print(f"  Copied index: {mat_type}")

def fix_abs_imports_in_features():
    """Replace ~/app/... absolute imports with ~/features/... in all feature files."""
    fixed_files = 0
    for f in (FEAT / "cms/materials").rglob("*.ts"):
        _fix_abs(f)
        fixed_files += 1
    for f in (FEAT / "cms/materials").rglob("*.tsx"):
        _fix_abs(f)
        fixed_files += 1
    print(f"Fixed absolute imports in {fixed_files} files")

def _fix_abs(f: Path):
    content = f.read_text()
    orig = content
    for old, new in ABS_MAP:
        content = content.replace(old, new)
    if content != orig:
        f.write_text(content)

def fix_abs_imports_in_pages():
    """Update pages that import from old ~/app/... materials paths."""
    pages = [
        FULL / "courses/[courseID]/(course)/materials/[materialID]/page.tsx",
        NORMAL / "courses/[courseID]/materials/new/page.tsx",
        TYPING / "materials/[materialID]/preview/page.tsx",
    ]
    for p in pages:
        if p.exists():
            content = p.read_text()
            orig = content
            for old, new in ABS_MAP:
                content = content.replace(old, new)
            if content != orig:
                p.write_text(content)
                print(f"  Fixed page: {p.relative_to(WEB / 'src')}")

def fix_rel_imports_in_features():
    """Fix relative imports within moved material type files."""
    # ABS_MAP already covers most; handle remaining relative imports
    reverse_map = {}
    for src_abs, dest_feat in COPY_MAPS:
        src_str = str(src_abs)
        dest_str = str(FEAT / dest_feat)
        reverse_map[src_str] = dest_str

    # Also add material type root
    for mat_type in ["CodeMaterial", "DocumentMaterial", "TypingMaterial"]:
        src = str(FULL / f"materials/[materialID]/_materialTypes/{mat_type}")
        dest = str(FEAT / f"cms/materials/types/{mat_type}")
        reverse_map[src] = dest

    fixed = 0
    for f in (FEAT / "cms/materials").rglob("*.tsx"):
        content = f.read_text()
        if 'from ".' in content:
            # Resolve relative imports from the original source location
            dest_str = str(f)
            src_file = None
            for src_dir, dest_dir in reverse_map.items():
                if dest_str.startswith(dest_dir + "/"):
                    rel = dest_str[len(dest_dir) + 1:]
                    src_file = Path(src_dir) / rel
                    break
            if src_file and src_file.exists():
                new_content = _fix_rel(content, src_file, reverse_map)
                if new_content != content:
                    f.write_text(new_content)
                    fixed += 1
    for f in (FEAT / "cms/materials").rglob("*.ts"):
        content = f.read_text()
        if 'from ".' in content:
            dest_str = str(f)
            src_file = None
            for src_dir, dest_dir in reverse_map.items():
                if dest_str.startswith(dest_dir + "/"):
                    rel = dest_str[len(dest_dir) + 1:]
                    src_file = Path(src_dir) / rel
                    break
            if src_file and src_file.exists():
                new_content = _fix_rel(content, src_file, reverse_map)
                if new_content != content:
                    f.write_text(new_content)
                    fixed += 1
    print(f"Fixed relative imports in {fixed} files")

def _fix_rel(content: str, src_file: Path, reverse_map: dict) -> str:
    def replace_import(m):
        full_match = m.group(0)
        quote = m.group(1)
        imp = m.group(2)
        if not imp.startswith("."):
            return full_match
        src_dir = src_file.parent
        for ext in ["", ".tsx", ".ts", "/index.tsx", "/index.ts"]:
            resolved = (src_dir / (imp + ext)).resolve()
            resolved_str = str(resolved)
            for src_dir_abs, dest_dir_abs in reverse_map.items():
                if resolved_str.startswith(src_dir_abs + "/"):
                    rel = resolved_str[len(src_dir_abs) + 1:]
                    rel = re.sub(r'\.(tsx?|js)$', '', rel)
                    rel = re.sub(r'/index$', '', rel)
                    feat_path = dest_dir_abs[len(str(FEAT)) + 1:]
                    return f'from {quote}~/features/{feat_path}/{rel}{quote}'
        return full_match
    return re.sub(r'from (["\'])(\.[^"\']+)\1', replace_import, content)

if __name__ == "__main__":
    print("=== Copy files ===")
    copy_files()
    copy_material_type_indexes()

    print("\n=== Fix absolute imports in features ===")
    fix_abs_imports_in_features()

    print("\n=== Fix relative imports in features ===")
    fix_rel_imports_in_features()

    print("\n=== Fix page imports ===")
    fix_abs_imports_in_pages()

    print("\nDone!")
