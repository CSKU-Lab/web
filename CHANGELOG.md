## [0.40.1](https://github.com/CSKU-Lab/web/compare/v0.40.0...v0.40.1) (2026-06-26)


### Bug Fixes

* **material:** defer inline editor mount to fix Safari scroll jump ([afff95b](https://github.com/CSKU-Lab/web/commit/afff95bd7a9d26845b91c06056aa68459962877a))
* **submission:** reconstruct segments on Use This Code ([8988a27](https://github.com/CSKU-Lab/web/commit/8988a2749beaff684fec958587ee3a20ecf65afc))

# [0.40.0](https://github.com/CSKU-Lab/web/compare/v0.39.0...v0.40.0) (2026-06-26)


### Bug Fixes

* **web:** exclude react-scan from production bundle ([e8bbc21](https://github.com/CSKU-Lab/web/commit/e8bbc21a9fd50f8206db3984f646999a1296e52b))


### Features

* **analytics:** load self-hosted Umami tracker ([5fb3c7c](https://github.com/CSKU-Lab/web/commit/5fb3c7c645845ec073854ca8aa1741c061842951))

# [0.39.0](https://github.com/CSKU-Lab/web/compare/v0.38.2...v0.39.0) (2026-06-26)


### Bug Fixes

* **code-material-embed:** persist submission state on reopen ([2f39619](https://github.com/CSKU-Lab/web/commit/2f3961929b0d86a069c6880a26439b0b86054df0))


### Features

* **core-material:** make resource limits section collapsible ([02094fc](https://github.com/CSKU-Lab/web/commit/02094fca8e1eff0a29bf78e4df034ee234431d2e))
* **material:** add clone button for same-course duplication ([3def4c7](https://github.com/CSKU-Lab/web/commit/3def4c7e7e103067f4502303c7280311c7f866d2))

## [0.38.2](https://github.com/CSKU-Lab/web/compare/v0.38.1...v0.38.2) (2026-06-26)


### Bug Fixes

* **CS-229:** rebind typing keydown listener on retry ([36dad8a](https://github.com/CSKU-Lab/web/commit/36dad8a60ab0d0a07b933bc05e241042d062da01))

## [0.38.1](https://github.com/CSKU-Lab/web/compare/v0.38.0...v0.38.1) (2026-06-25)


### Bug Fixes

* **cms:** collapse hidden lines via segment normalization ([7f06566](https://github.com/CSKU-Lab/web/commit/7f06566603474d7bcca598ccd95c7d0b7a898f83))

# [0.38.0](https://github.com/CSKU-Lab/web/compare/v0.37.1...v0.38.0) (2026-06-25)


### Features

* **typing-material:** support tab key in source text editor ([4451655](https://github.com/CSKU-Lab/web/commit/4451655ba5b59d1721afa7138e96bade28c66d84))

## [0.37.1](https://github.com/CSKU-Lab/web/compare/v0.37.0...v0.37.1) (2026-06-25)


### Bug Fixes

* **cms:** hidden segment marks absorb trailing newline ([463aeaa](https://github.com/CSKU-Lab/web/commit/463aeaa1b4f39137dc315d9afbf01da10990e48f))
* **lab-material:** send full order on reorder, invalidate cache ([052cf2f](https://github.com/CSKU-Lab/web/commit/052cf2f94a9a4168bb723bc88d4e3074b58ba09e))

# [0.37.0](https://github.com/CSKU-Lab/web/compare/v0.36.0...v0.37.0) (2026-06-25)


### Features

* **tiptap:** show code block language selector only in CMS ([198fe95](https://github.com/CSKU-Lab/web/commit/198fe95dc1c5fd091b3978a16fea8ee9de4b729a))

# [0.36.0](https://github.com/CSKU-Lab/web/compare/v0.35.0...v0.36.0) (2026-06-25)


### Bug Fixes

* **cms:** store hidden-stripped content for solution files ([9a209d0](https://github.com/CSKU-Lab/web/commit/9a209d09af2680dfe4a32ec898d4d059eb244611))


### Features

* **editor:** collapse file tree by default ([88b36fe](https://github.com/CSKU-Lab/web/commit/88b36fe6ca5d63f0e088a03e2e3d09432f5b3d4a))

# [0.35.0](https://github.com/CSKU-Lab/web/compare/v0.34.0...v0.35.0) (2026-06-25)


### Features

* **cms:** show segment marks in solution tab ([4535f9a](https://github.com/CSKU-Lab/web/commit/4535f9aae7662b5f740df27551f5d6c04be37105))

# [0.34.0](https://github.com/CSKU-Lab/web/compare/v0.33.0...v0.34.0) (2026-06-25)


### Bug Fixes

* send solution segments and runnable content to grader ([d80b6b3](https://github.com/CSKU-Lab/web/commit/d80b6b3a2b14716ff5269c6efd99a7cfbd142ba7))
* stop highlighting plain text code blocks as code ([0721d45](https://github.com/CSKU-Lab/web/commit/0721d45085a715ca41479b363c14705f5ade1502))


### Features

* **typing:** support tab/enter keys and show whitespace glyphs ([49d0f4a](https://github.com/CSKU-Lab/web/commit/49d0f4a55228da9b863385e65408a4b9366b70ed))

# [0.33.0](https://github.com/CSKU-Lab/web/compare/v0.32.0...v0.33.0) (2026-06-25)


### Features

* add language selector to tiptap code block ([3acd619](https://github.com/CSKU-Lab/web/commit/3acd6198b4b74b80eb5822a1dd6bb8e9306d36ad))

# [0.32.0](https://github.com/CSKU-Lab/web/compare/v0.31.0...v0.32.0) (2026-06-25)


### Bug Fixes

* invalidate material query after typing submission to refresh header status ([e8906e4](https://github.com/CSKU-Lab/web/commit/e8906e43da350584c2b501fc7d8757532842fcec))


### Features

* **editor:** allow deleting .bak backup files in solution editor ([793e85e](https://github.com/CSKU-Lab/web/commit/793e85e2d2039a02fad1cb265e4aec906c8e662c))
* highlight typing submission rows red only when error rate > 3% and adj WPM < 30 ([465b24d](https://github.com/CSKU-Lab/web/commit/465b24d4ecb8371484d4ccce725da1d172ff9cc1))

# [0.31.0](https://github.com/CSKU-Lab/web/compare/v0.30.0...v0.31.0) (2026-06-24)


### Features

* restyle typing material editor to match preview layout ([74bcbdb](https://github.com/CSKU-Lab/web/commit/74bcbdb7d3d553826435cc03fc5c0ab279c7cb05))

# [0.30.0](https://github.com/CSKU-Lab/web/compare/v0.29.0...v0.30.0) (2026-06-24)


### Features

* display typing stats with 2 decimal places ([16d741b](https://github.com/CSKU-Lab/web/commit/16d741b4c639df086c25186686afab0f2c6a2ad4))

# [0.29.0](https://github.com/CSKU-Lab/web/compare/v0.28.1...v0.29.0) (2026-06-24)


### Features

* remove text labels from segment marks, use color only ([41470d4](https://github.com/CSKU-Lab/web/commit/41470d4fe71f7a932610fe4d376d0cd97757af88))

## [0.28.1](https://github.com/CSKU-Lab/web/compare/v0.28.0...v0.28.1) (2026-06-24)


### Bug Fixes

* prevent code duplication in SegmentedFileEditor preview tab ([52ceed9](https://github.com/CSKU-Lab/web/commit/52ceed918fd1c8fca82e73342e66a3d89b1397dd))

# [0.28.0](https://github.com/CSKU-Lab/web/compare/v0.27.1...v0.28.0) (2026-06-23)


### Features

* **CS-187:** add edit mode to section labs page ([4d0b18e](https://github.com/CSKU-Lab/web/commit/4d0b18ede8acea3c3259bdf1e35f6ba57e5daebc))
* **CS-187:** refine edit mode UX ([c070435](https://github.com/CSKU-Lab/web/commit/c0704351a97f5e0e63d9f9a344bfe129607ad6b5))
* **CS-187:** simplify edit mode — keep reorder, multi-select, bulk status, and dialog for adding labs ([ee8880c](https://github.com/CSKU-Lab/web/commit/ee8880c73510489aad3cefa4cde8da0ad8759c2f))
* **CS-217:** add limit field descriptions and default values for new code material ([c6ed167](https://github.com/CSKU-Lab/web/commit/c6ed16766de07703161704773e1f7a1f7dad07ff))
* **CS-219:** visible readonly/hidden/exclude segment indicators in editor ([91cb611](https://github.com/CSKU-Lab/web/commit/91cb611ba87fd4bb297ca6e6e972b21f87befffe))
* show create option in tag autocomplete when input is substring of existing tags ([0a1952d](https://github.com/CSKU-Lab/web/commit/0a1952d65ebf410cf0c132bc49747719c88bd790))

## [0.27.1](https://github.com/CSKU-Lab/web/compare/v0.27.0...v0.27.1) (2026-06-23)


### Bug Fixes

* **CS-214:** cast to string for legacy "type" enum comparison ([a39df28](https://github.com/CSKU-Lab/web/commit/a39df28760986a002aa920ffcc1c224e99cc3a7c))

# [0.27.0](https://github.com/CSKU-Lab/web/compare/v0.26.0...v0.27.0) (2026-06-23)


### Bug Fixes

* **CS-214:** handle legacy "type" value for typing material type in frontend ([ae27d0b](https://github.com/CSKU-Lab/web/commit/ae27d0bd6f64e1a5573daba86485dcfb4591b9cd))
* **CS-216:** reset submission and runner state when switching materials ([38a89f2](https://github.com/CSKU-Lab/web/commit/38a89f2e8509873ffe5a903e3a93159617e910fb))
* **CS-218:** preserve code segment decorations across preview/edit mode switch ([f983b74](https://github.com/CSKU-Lab/web/commit/f983b743be2316bde628eda92527e404470eeb4b))
* **CS-220:** fix first-line indentation inconsistency in code blocks ([812c551](https://github.com/CSKU-Lab/web/commit/812c55173bb142d9c4b112577f438b3734bf78f4))


### Features

* **CS-222:** add runner change detection and reload banner in Solution tab ([81aad76](https://github.com/CSKU-Lab/web/commit/81aad76cf02c906c6a46ec3e8312a2f31a288dfc))

# [0.26.0](https://github.com/CSKU-Lab/web/compare/v0.25.0...v0.26.0) (2026-06-22)


### Features

* **CS-195:** collapsible file tree in CodeEditor, hide add file in SolutionTab ([f7d1d87](https://github.com/CSKU-Lab/web/commit/f7d1d873577f8e37dac3788f18036b3ffa1d3387))
* **CS-195:** collapsible FileTree in CodePreview, replace-code button in submission detail ([9e0b6f8](https://github.com/CSKU-Lab/web/commit/9e0b6f890ece9b7559d737526121b7b5730a2d9e))
* hide AI Assistant tab in core content code material ([248a25c](https://github.com/CSKU-Lab/web/commit/248a25c035fe897ebc183cecbfe8fd39dd017db4))

# [0.25.0](https://github.com/CSKU-Lab/web/compare/v0.24.0...v0.25.0) (2026-06-22)


### Bug Fixes

* **CS-189:** show score for exam typing submissions ([1f02900](https://github.com/CSKU-Lab/web/commit/1f02900a610173627a127633b36ad79aca0e4132))
* **CS-210:** increase inline code editor height and disable playground ([1da2801](https://github.com/CSKU-Lab/web/commit/1da2801edcaff6809a407dcda38ede5e8730500d))
* **CS-210:** make CodeEditor flex parent so flex-1 fills h-[520px] container ([b185c29](https://github.com/CSKU-Lab/web/commit/b185c29a88a3ae14d4fd5b6ec422cfe95dff51af))
* **CS-211:** track editable segment positions via rangesField, drop indexOf extraction ([6a62c2b](https://github.com/CSKU-Lab/web/commit/6a62c2ba604a73021951cb08db7269e326a503a3))
* make config tab scrollable on overflow ([75513e1](https://github.com/CSKU-Lab/web/commit/75513e162b926383ee811805dbf6cfbda00ab5ad))


### Features

* **CS-189:** replace auto score section with practice/exam typing type selector ([9ffe16e](https://github.com/CSKU-Lab/web/commit/9ffe16efd2658d52308f940a126c903c067e246d))
* **CS-191:** add Export Typing button to gradebook page ([ccfcf31](https://github.com/CSKU-Lab/web/commit/ccfcf315bf10046f6a85225997fae09de35fe62a))
* **CS-210:** embed code material in document material ([51b48bc](https://github.com/CSKU-Lab/web/commit/51b48bc9bdb78e34d5b7075ad22d67b81f8ec968))
* **CS-210:** enable playground for embedded code problems in student view ([11744c9](https://github.com/CSKU-Lab/web/commit/11744c94c359395053bc98453830e402739d894e))
* **CS-211:** redesign SegmentedFileEditor with tabs and interactive preview ([2932d84](https://github.com/CSKU-Lab/web/commit/2932d8457fe4742d5ac22ecf7555d7e46f8e94c5))
* **CS-211:** segment-aware code editor for CMS and student view ([d5556c3](https://github.com/CSKU-Lab/web/commit/d5556c3e052f333fcc0e35704b694d7d16b1476d))
* redesign enrolled course card with section/semester detail ([adc1104](https://github.com/CSKU-Lab/web/commit/adc1104f6949e216741d5a2178d4cfcd8569c331))
* redesign enrolled course list with image-on-top card layout ([a87b263](https://github.com/CSKU-Lab/web/commit/a87b263bcd2d952e1b5b39c3d0093ce43bfa243c))

# [0.24.0](https://github.com/CSKU-Lab/web/compare/v0.23.1...v0.24.0) (2026-06-21)


### Features

* redesign user management UI for multi-provider auth ([3a6dfa1](https://github.com/CSKU-Lab/web/commit/3a6dfa1a61ddfd3d3a6dc5778d76085e6b527938))

## [0.23.1](https://github.com/CSKU-Lab/web/compare/v0.23.0...v0.23.1) (2026-06-21)


### Bug Fixes

* build failed ([dbfe00a](https://github.com/CSKU-Lab/web/commit/dbfe00abd801f5c238a38186b508d553606c191d))

# [0.23.0](https://github.com/CSKU-Lab/web/compare/v0.22.0...v0.23.0) (2026-06-21)


### Bug Fixes

* correct role filter field from "role" to "roles" in UserAutoComplete ([274f221](https://github.com/CSKU-Lab/web/commit/274f2214d6505829cbc750225f8713a31dec5fee))
* **CS-205:** rename limit to limits to match server JSON field name ([f4e838b](https://github.com/CSKU-Lab/web/commit/f4e838bb40d277eda540f274f8c208ae11dee6db))
* **CS-206:** move name/tag search to backend, remove client-side filter ([a3f9fb8](https://github.com/CSKU-Lab/web/commit/a3f9fb8768866902782b4e115c704b2c7934cfda))
* **CS-207:** break typing material text at word boundaries ([8d35acc](https://github.com/CSKU-Lab/web/commit/8d35acc1a995a7101e04294337fce8b2a449d5de))
* **CS-207:** skip breadcrumb fetch when section segment is "new" ([d89b553](https://github.com/CSKU-Lab/web/commit/d89b5538c4bec86b0392abb13c00125f0f189940))
* fix Checkbox checkmark invisible in dark mode ([11d5b1d](https://github.com/CSKU-Lab/web/commit/11d5b1d13eaadefd07726c341776cf7e10f04278)), closes [#eeeeee](https://github.com/CSKU-Lab/web/issues/eeeeee) [#111111](https://github.com/CSKU-Lab/web/issues/111111)
* prevent last character wrapping to new line in typing display ([b3df495](https://github.com/CSKU-Lab/web/commit/b3df495fe769ca4813e202e172e280c815adaa23))
* redirect to labs list before query invalidation on lab removal ([c4d20ac](https://github.com/CSKU-Lab/web/commit/c4d20aca0e075d47aee83daf977de9befc01a051))
* restore checkmark visibility in Checkbox component ([c52d6f1](https://github.com/CSKU-Lab/web/commit/c52d6f159134cdb936fcf8a03d4d5ea9b75425a0))


### Features

* add tag search and material type filter in Add Materials panel ([5b572b5](https://github.com/CSKU-Lab/web/commit/5b572b5966d23fd599a42b024385c6d596849d7f))
* add test case group indicators to submission detail testcase table ([db8cb1c](https://github.com/CSKU-Lab/web/commit/db8cb1c1ffd75b03e2c06f87184b30d9dffda1fc))
* **CS-208:** restrict instructor role from course/lab write operations ([48194ec](https://github.com/CSKU-Lab/web/commit/48194ec0f66068c3f22d31037b214d34c63aa06a))
* improve add material drawer button contrast and layout ([4e9ebb6](https://github.com/CSKU-Lab/web/commit/4e9ebb6e5998967985b06f380492235ac0f676c8))
* increase section card size and redesign section settings banner layout ([2ee7082](https://github.com/CSKU-Lab/web/commit/2ee7082396edea17b0f7a1bbf8300ec194b7abbf))
* move "Add Test Case" button to end of each test case group ([7d5ba65](https://github.com/CSKU-Lab/web/commit/7d5ba65b84114a71958c68bf9e19002ec5d97e15))
* move default compare script settings to compares page as dialog ([9613c10](https://github.com/CSKU-Lab/web/commit/9613c107247efbce0dc63e6bd7dec5a9d9b42593))
* redesign section/course cards with aspect-video banner overlay layout ([b2c053f](https://github.com/CSKU-Lab/web/commit/b2c053fd66aade5be4ec4104ed77d955b6bd107f))
* replace static select with searchable combobox in DefaultCompareScriptDialog ([b1327f5](https://github.com/CSKU-Lab/web/commit/b1327f53d89c06eb5b8cc6b75974e3ff523b126b))
* show test case count badge on Test Cases tab button ([409426c](https://github.com/CSKU-Lab/web/commit/409426c95f81f36ef25cbcdaa4a8cef82c072112))

# [0.22.0](https://github.com/CSKU-Lab/web/compare/v0.21.0...v0.22.0) (2026-06-20)


### Features

* **CS-197:** add admin settings page with default compare script selector ([8a5ce33](https://github.com/CSKU-Lab/web/commit/8a5ce3384adb8cc4911286e8d6f836f0e2afc1bd))

# [0.21.0](https://github.com/CSKU-Lab/web/compare/v0.20.0...v0.21.0) (2026-06-20)


### Bug Fixes

* **CS-199:** make trash always visible in row, match dialog style to existing patterns ([dcf3de1](https://github.com/CSKU-Lab/web/commit/dcf3de1a7c11e1f1fb3a2efe15f117dcc0cf51b6))
* **CS-199:** move delete description out of dialog header into body ([600b94d](https://github.com/CSKU-Lab/web/commit/600b94d0dd813350c52a2e754ea3a9f26867c624))


### Features

* **CS-199:** add delete submission button with confirm dialog for instructors ([185d8e8](https://github.com/CSKU-Lab/web/commit/185d8e8e3ff34ce6df550e8b497e89490aea56da))

# [0.20.0](https://github.com/CSKU-Lab/web/compare/v0.19.1...v0.20.0) (2026-06-20)


### Bug Fixes

* **cms:** move section detail overlay closer to bottom-left corner ([669874b](https://github.com/CSKU-Lab/web/commit/669874be78c8503106336f125b35cfa559234c59))


### Features

* **cms:** add Regrade All button for code material submissions ([86d7934](https://github.com/CSKU-Lab/web/commit/86d7934c3e2902928b9e1f37c2936d82c0aa0bd8))
* **cms:** move section detail overlay inside banner upload widget ([6196a1c](https://github.com/CSKU-Lab/web/commit/6196a1c9fe79ecb36f8153ffdc8ab864bbdfee4f))

## [0.19.1](https://github.com/CSKU-Lab/web/compare/v0.19.0...v0.19.1) (2026-06-20)


### Bug Fixes

* replace invalid Button variant "outline" with "ghost" ([e84f076](https://github.com/CSKU-Lab/web/commit/e84f0762748657cb38025fde2fbaa1c20c5503a4))

# [0.19.0](https://github.com/CSKU-Lab/web/compare/v0.18.0...v0.19.0) (2026-06-20)


### Bug Fixes

* always show All Submissions button ([5309db6](https://github.com/CSKU-Lab/web/commit/5309db6c26369ea21a5b2bee42627ccbe26d183b))
* move action buttons below typed text, remove section divider ([e6f169c](https://github.com/CSKU-Lab/web/commit/e6f169c56366f089b1352f80ebe556dfc10ba8aa))
* move All Submissions button below typing text ([516757a](https://github.com/CSKU-Lab/web/commit/516757a627d532f44977f469b30bf68dc407941e))
* prevent text shift in typing display on mistype ([8b5d514](https://github.com/CSKU-Lab/web/commit/8b5d514798af0697920df2f5fe5401c290132531))
* remove submission status display from student typing completion view ([8b53f71](https://github.com/CSKU-Lab/web/commit/8b53f7139f11903609148dd465a5377eb988a421))
* round accuracy to 2 decimal places ([47669c5](https://github.com/CSKU-Lab/web/commit/47669c50d7978c05f9da180adc7a28f0a59b9776))
* sort lab materials by position ascending in expanded lab view ([38c9911](https://github.com/CSKU-Lab/web/commit/38c99113993951b5df9070ecd99980e6f0bc824b))
* **typing:** suppress loading flash on ESC/retry by tracking isRestarting state ([908a91a](https://github.com/CSKU-Lab/web/commit/908a91ac03ed1df2f3da8cd184eeba82ee69a499))


### Features

* CS-188 stay on typing page after completion with results overlay ([3fd7701](https://github.com/CSKU-Lab/web/commit/3fd77018e4d4daf629a54f7cf8518a5e883c2b4f))
* remove realtime stats bar during typing, show stats only on completion ([099d931](https://github.com/CSKU-Lab/web/commit/099d931bac3f79101fd1211534b345bd53afc276))
* remove realtime WPM display during typing ([fd664a5](https://github.com/CSKU-Lab/web/commit/fd664a531fbcc563fc6df7eee9bbe292e528eb89))
* restore StatsBar during typing, use compact stats style on completion ([0c2a0e5](https://github.com/CSKU-Lab/web/commit/0c2a0e5f25e297e67f51d3aef84d4fad89562863))
* show stats above typed text review instead of full-screen overlay ([4983b01](https://github.com/CSKU-Lab/web/commit/4983b0136834562182cc10618f669232cc561112))

# [0.18.0](https://github.com/CSKU-Lab/web/compare/v0.17.9...v0.18.0) (2026-06-20)


### Features

* implement feature request tasks CS-190, CS-194, CS-195, CS-200 ([d04f0f7](https://github.com/CSKU-Lab/web/commit/d04f0f77a0658c18c0180bf84de5e9da04a42a33))

## [0.17.9](https://github.com/CSKU-Lab/web/compare/v0.17.8...v0.17.9) (2026-06-20)


### Bug Fixes

* remove link from lab name in core content sidebar ([897be89](https://github.com/CSKU-Lab/web/commit/897be8973be7867f0fa9511787b44cd3dd832ac1))

## [0.17.8](https://github.com/CSKU-Lab/web/compare/v0.17.7...v0.17.8) (2026-06-20)


### Bug Fixes

* use light Radix gray scale for CodeMirror light theme ([2b96583](https://github.com/CSKU-Lab/web/commit/2b96583be7fa897e848fff30f208e2d12abeac8b))

## [0.17.7](https://github.com/CSKU-Lab/web/compare/v0.17.6...v0.17.7) (2026-06-20)


### Bug Fixes

* add position field to LabMaterial interface ([acce182](https://github.com/CSKU-Lab/web/commit/acce182f704921ca5af2cd2843adbd495007ce97))
* invert CodeMirror light mode theme colors ([f51d9fa](https://github.com/CSKU-Lab/web/commit/f51d9fac911c7fbb611cb9771868e082513cdf09))

## [0.17.6](https://github.com/CSKU-Lab/web/compare/v0.17.5...v0.17.6) (2026-06-20)


### Bug Fixes

* default test case group score to 1 ([ebf7d5b](https://github.com/CSKU-Lab/web/commit/ebf7d5b6fa9e6fb425420cf018e65fb638f62d02))
* sort core lab materials by position to match CMS ordering ([b8fc964](https://github.com/CSKU-Lab/web/commit/b8fc964111fe5b30193a3980430475662b75b397))

## [0.17.5](https://github.com/CSKU-Lab/web/compare/v0.17.4...v0.17.5) (2026-06-20)


### Bug Fixes

* all code which require crypto ([9f75e41](https://github.com/CSKU-Lab/web/commit/9f75e416ae5b4ce327423e0fb704cc50943c5885))
* crypto only available in https ([2e73912](https://github.com/CSKU-Lab/web/commit/2e73912afe43d0392e12ced3f23b0b97d52a2f90))

## [0.17.4](https://github.com/CSKU-Lab/web/compare/v0.17.3...v0.17.4) (2026-06-20)


### Bug Fixes

* use resolvedTheme for CodeMirror and add pending state to playground ([a260785](https://github.com/CSKU-Lab/web/commit/a260785f9ac37d7849fa8f06f46ba63996627a11))

## [0.17.3](https://github.com/CSKU-Lab/web/compare/v0.17.2...v0.17.3) (2026-06-20)


### Bug Fixes

* filter students by role in section creation and improve dark mode switch contrast ([11418ac](https://github.com/CSKU-Lab/web/commit/11418ac6ed79c093eb1ae592a63264fdf4191625))

## [0.17.2](https://github.com/CSKU-Lab/web/compare/v0.17.1...v0.17.2) (2026-06-20)


### Bug Fixes

* clarify material visibility public text to say Every Instructors ([876502c](https://github.com/CSKU-Lab/web/commit/876502c6c837322485289fa95b0c8f15a2700cb0))

## [0.17.1](https://github.com/CSKU-Lab/web/compare/v0.17.0...v0.17.1) (2026-06-08)


### Bug Fixes

* client env settings on new nextjs version ([59bc96f](https://github.com/CSKU-Lab/web/commit/59bc96fd532edcb917c393049d46a958fb8891b7))

# [0.17.0](https://github.com/CSKU-Lab/web/compare/v0.16.1...v0.17.0) (2026-06-03)


### Bug Fixes

* active text color in typing material ([defdd72](https://github.com/CSKU-Lab/web/commit/defdd7281577f8a00dab492f6ee8e3bc2d1c765b))


### Features

* add keyboard shortcut to run playground ([4fd4841](https://github.com/CSKU-Lab/web/commit/4fd4841a8501b94675d65095410aef84e925df7c))
* implement typing material renderer in material submission ([b5acfd9](https://github.com/CSKU-Lab/web/commit/b5acfd94b944ecd0714eaccc939701c8a2c7882e))
* improve typing material ([2a59ee5](https://github.com/CSKU-Lab/web/commit/2a59ee5295c2645060429c93a117619ac5d2decc))

## [0.16.1](https://github.com/CSKU-Lab/web/compare/v0.16.0...v0.16.1) (2026-05-30)


### Bug Fixes

* scrollbar shown on list page and playground content sizing bug ([3db4e84](https://github.com/CSKU-Lab/web/commit/3db4e84953b92cc22dedceee1c0362cd23adebdb))

# [0.16.0](https://github.com/CSKU-Lab/web/compare/v0.15.3...v0.16.0) (2026-05-30)


### Features

* **refactor:** extract cms/courses, sections, submissions into features ([a332311](https://github.com/CSKU-Lab/web/commit/a33231117bfe71d0ef9cea70cf19697ebb74b51d))
* **refactor:** extract cms/materials and cms/layout into features ([3e786c5](https://github.com/CSKU-Lab/web/commit/3e786c59853fcd7eb748404b5b576e55279ae44e))
* **refactor:** extract core/{home,courses,sections,materials} into features ([4406225](https://github.com/CSKU-Lab/web/commit/4406225578397d39ff0163e956e4100866a0e682))
* **refactor:** extract shared sidebar and search into features ([74d9a24](https://github.com/CSKU-Lab/web/commit/74d9a24d7d1b6ec145f8425edcc8022481e92325))
* **refactor:** move auth, lessons, and cms nav configs to features ([960092f](https://github.com/CSKU-Lab/web/commit/960092f1f96a4883f7ae9a97944d90e97345cf52))

## [0.15.3](https://github.com/CSKU-Lab/web/compare/v0.15.2...v0.15.3) (2026-05-24)


### Bug Fixes

* og image ([b4afaa3](https://github.com/CSKU-Lab/web/commit/b4afaa34761552d4307f950fab23c7b2bab263a9))

## [0.15.2](https://github.com/CSKU-Lab/web/compare/v0.15.1...v0.15.2) (2026-05-24)


### Bug Fixes

* og image fallback ([60654ce](https://github.com/CSKU-Lab/web/commit/60654ce18102b5f4153798142713646848df570d))

## [0.15.1](https://github.com/CSKU-Lab/web/compare/v0.15.0...v0.15.1) (2026-05-24)


### Bug Fixes

* og image fetch make web server hang ([d400893](https://github.com/CSKU-Lab/web/commit/d4008933f5205774e5f637707baee43a10ebba42))

# [0.15.0](https://github.com/CSKU-Lab/web/compare/v0.14.4...v0.15.0) (2026-05-24)


### Features

* add LSP support for CodeMirror 6 via lsp-service ([ba26adf](https://github.com/CSKU-Lab/web/commit/ba26adf4359305a4715262a7ac0af5b2a1775bbe))

## [0.14.4](https://github.com/CSKU-Lab/web/compare/v0.14.3...v0.14.4) (2026-05-24)


### Bug Fixes

* use og image from s3 instead ([3988c44](https://github.com/CSKU-Lab/web/commit/3988c442c14c1862954c53af5553983868fa0f58))

## [0.14.3](https://github.com/CSKU-Lab/web/compare/v0.14.2...v0.14.3) (2026-05-24)


### Bug Fixes

* change metadata baseurl ([d431da5](https://github.com/CSKU-Lab/web/commit/d431da578a77dbfb6c59313d7940600b14f641e7))

## [0.14.2](https://github.com/CSKU-Lab/web/compare/v0.14.1...v0.14.2) (2026-05-24)


### Bug Fixes

* build failed ([d2b409a](https://github.com/CSKU-Lab/web/commit/d2b409a7f0f93109cea434020f8b97c6922f20bd))

## [0.14.1](https://github.com/CSKU-Lab/web/compare/v0.14.0...v0.14.1) (2026-05-23)


### Bug Fixes

* build failed ([5f0c4cf](https://github.com/CSKU-Lab/web/commit/5f0c4cf6e9c1f152e4cd8d46b8d40e4c1b2540cb))

# [0.14.0](https://github.com/CSKU-Lab/web/compare/v0.13.1...v0.14.0) (2026-05-23)


### Features

* add og image ([f1e68c8](https://github.com/CSKU-Lab/web/commit/f1e68c8e95001ef0d980bc21aeac776ed620c58c))
* implement page metadata ([6761a4f](https://github.com/CSKU-Lab/web/commit/6761a4fa27ea862f21a6e3c10a00b11ccc6adb7b))
* show resource limits only when has some ([b77e343](https://github.com/CSKU-Lab/web/commit/b77e343d47d98a8475f21c948af1a205053b240a))

## [0.13.1](https://github.com/CSKU-Lab/web/compare/v0.13.0...v0.13.1) (2026-05-23)


### Bug Fixes

* put condition above hooks cause render error ([7fdf7f7](https://github.com/CSKU-Lab/web/commit/7fdf7f70b2008397b7d48603db30eaa5134fbc86))

# [0.13.0](https://github.com/CSKU-Lab/web/compare/v0.12.0...v0.13.0) (2026-05-23)


### Features

* add fallback page when user got rate limitted ([1189a83](https://github.com/CSKU-Lab/web/commit/1189a83a1385ebdeef2ccd7db772234b9a4b1048))

# [0.12.0](https://github.com/CSKU-Lab/web/compare/v0.11.0...v0.12.0) (2026-05-23)


### Features

* update badge style for course card ([28cd0c3](https://github.com/CSKU-Lab/web/commit/28cd0c341cbc1f057c3500d0c1c270757525b095))

# [0.11.0](https://github.com/CSKU-Lab/web/compare/v0.10.0...v0.11.0) (2026-05-23)


### Features

* **core:** add command palette ([7aefcb9](https://github.com/CSKU-Lab/web/commit/7aefcb9fc1a693f47148c53b78f2c761df80c18a))
* **section:** add delete section lab dialog ([9a191ae](https://github.com/CSKU-Lab/web/commit/9a191ae33e8b8605c3baa6e8cc61388c4035d77e))

# [0.10.0](https://github.com/CSKU-Lab/web/compare/v0.9.0...v0.10.0) (2026-05-23)


### Bug Fixes

* improve add and edit user error ([c0b4731](https://github.com/CSKU-Lab/web/commit/c0b4731cdeedc8e36d080266035290d9549089cb))
* update export button in section gradebook page ([b2c5055](https://github.com/CSKU-Lab/web/commit/b2c5055740d07d95764ea91cdb124c148f0d4c72))


### Features

* **core:** improve labs page ([7f199a8](https://github.com/CSKU-Lab/web/commit/7f199a87df0aee15ac56034fd1948be58161117d))

# [0.9.0](https://github.com/CSKU-Lab/web/compare/v0.8.0...v0.9.0) (2026-05-23)


### Bug Fixes

* import user ([f0592ce](https://github.com/CSKU-Lab/web/commit/f0592ce8cf7022fff602074739aceb5c39bba3d4))


### Features

* add delete button for runner and material ([d41e2ca](https://github.com/CSKU-Lab/web/commit/d41e2ca5e40fb858e27d790b38ba87f662db44eb))
* improve command palette ([fdd82eb](https://github.com/CSKU-Lab/web/commit/fdd82eb49803709c289d3dd92d05b1d3bc4a0f5b))

# [0.8.0](https://github.com/CSKU-Lab/web/compare/v0.7.0...v0.8.0) (2026-05-22)


### Features

* implement command pallete ([12a2365](https://github.com/CSKU-Lab/web/commit/12a23655e5e017eccd74b7adf40443ed132078c6))

# [0.7.0](https://github.com/CSKU-Lab/web/compare/v0.6.1...v0.7.0) (2026-05-22)


### Features

* **material:** add a document material ([7736ad1](https://github.com/CSKU-Lab/web/commit/7736ad1a025899202be6fccf1200de377704bcd9))

## [0.6.1](https://github.com/CSKU-Lab/web/compare/v0.6.0...v0.6.1) (2026-05-22)


### Bug Fixes

* improve web load ux and wrong redirect ([2a2608d](https://github.com/CSKU-Lab/web/commit/2a2608df0bbec5f31e2847fe09d2c0a59a8ed95e))

# [0.6.0](https://github.com/CSKU-Lab/web/compare/v0.5.0...v0.6.0) (2026-05-21)


### Features

* **course:** improve course lab materials management ([c54896a](https://github.com/CSKU-Lab/web/commit/c54896a6be648b42cefa06965a1fe8bb0ff75432))

# [0.5.0](https://github.com/CSKU-Lab/web/compare/v0.4.1...v0.5.0) (2026-05-19)


### Features

* update material CMS pages and hooks ([70439b0](https://github.com/CSKU-Lab/web/commit/70439b0686c0a8f0aac9de34ee8f8fbaa49475be))
