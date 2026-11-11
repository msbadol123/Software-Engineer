import { Category, Software, DownloadRecord, Profile, AdSetting, SiteSettings, AuthUser } from '../types';
import { getSupabaseClient, isSupabaseConnected } from '../lib/supabase';

// Initial pre-seeded categories (confirmed in Phase 1)
const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-devops',
    name: 'Developer & DevOps Tools',
    slug: 'developer-devops',
    description: 'Code editors, container tooling, API workbenches, terminal emulators, and local development clusters.',
    icon: 'Terminal',
    display_order: 1,
    software_count: 5,
  },
  {
    id: 'cat-creative',
    name: 'Design, Creative & Video Software',
    slug: 'design-creative-video',
    description: 'Vector illustrators, 3D modelling suites, open-source video editors, and audio digital workstations.',
    icon: 'Palette',
    display_order: 2,
    software_count: 4,
  },
  {
    id: 'cat-productivity',
    name: 'Productivity & Office Suites',
    slug: 'productivity-office',
    description: 'Markdown knowledge graphs, project management assistants, local documentation wikis, and document builders.',
    icon: 'Briefcase',
    display_order: 3,
    software_count: 4,
  },
  {
    id: 'cat-security',
    name: 'Security, Privacy & System Utilities',
    slug: 'security-privacy-utilities',
    description: 'Zero-knowledge password vaults, secure VPN protocols, disk telemetry optimizers, and archive archivers.',
    icon: 'ShieldCheck',
    display_order: 4,
    software_count: 4,
  },
];

// Rich, realistic software catalog pre-seeded for immediate functionality
const INITIAL_SOFTWARE: Software[] = [
  {
    id: 'soft-vscode',
    title: 'CodeSphere IDE',
    slug: 'codesphere-ide',
    short_description: 'Next-generation lightweight code editor with native Language Server Protocol and AI pairing hooks.',
    full_description: 'CodeSphere IDE reimagines the developer workspace with blazingly fast startup times, integrated Git graph tree inspection, multi-cursor editing, and seamless debugging across Node.js, Python, Rust, and Go environments. Includes built-in terminal splitting and syntax highlighting for over 90 languages.',
    version: '2.4.1',
    category_id: 'cat-devops',
    category_name: 'Developer & DevOps Tools',
    platform: 'Cross-Platform',
    system_requirements: 'Windows 10/11, macOS 12+ (Apple Silicon or Intel), or Linux x64 with glibc 2.28+. Minimum 4GB RAM, 1GB disk space.',
    is_paid: false,
    price: 0,
    currency: 'USD',
    developer_name: 'Spherical Software Collective',
    developer_url: 'https://github.com/software-engineer/codesphere',
    thumbnail_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    ],
    download_url: 'https://drive.google.com/file/d/1B7lG4j7Q9pLqZ5-sample-codesphere/view?usp=sharing',
    download_count: 1420,
    is_published: true,
    is_featured: true,
    seo_title: 'Download CodeSphere IDE — Fast, Extensible Code Editor',
    seo_description: 'Free download of CodeSphere IDE. The high-performance modern developer editor for web and systems engineering.',
    created_at: '2026-01-15T10:00:00Z',
    updated_at: '2026-03-01T14:20:00Z',
  },
  {
    id: 'soft-docker-orchestrator',
    title: 'ClusterPilot Desktop',
    slug: 'clusterpilot-desktop',
    short_description: 'Visual container runtime and microservice orchestrator for local Kubernetes and Docker nodes.',
    full_description: 'ClusterPilot Desktop gives backend and DevOps engineers instant single-click visibility into containers, network bridges, volume mounts, and secret stores. Easily inspect live log streams, inspect CPU/memory throttling in real time, and mock ingress routing locally.',
    version: '3.1.0',
    category_id: 'cat-devops',
    category_name: 'Developer & DevOps Tools',
    platform: 'Cross-Platform',
    system_requirements: 'macOS Sonoma or Ventura, Windows 11 with WSL2 enabled, or Ubuntu 22.04+. 8GB RAM recommended.',
    is_paid: false,
    price: 0,
    currency: 'USD',
    developer_name: 'KubeCraft Labs',
    developer_url: 'https://kubecraft.internal',
    thumbnail_url: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&w=600&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=1200&q=80',
    ],
    download_url: 'https://github.com/kubecraft/clusterpilot/releases/download/v3.1.0/ClusterPilot-Installer.pkg',
    download_count: 980,
    is_published: true,
    is_featured: true,
    seo_title: 'ClusterPilot Desktop — Visual Kubernetes & Container Manager',
    seo_description: 'Manage Docker and Kubernetes pods with a smooth visual dashboard on Mac, Windows, and Linux.',
    created_at: '2026-02-01T08:30:00Z',
    updated_at: '2026-03-04T12:00:00Z',
  },
  {
    id: 'soft-postman-alt',
    title: 'RestForge API Studio',
    slug: 'restforge-api-studio',
    short_description: 'Offline-first REST, GraphQL, and gRPC workbench with encrypted team environment syncing.',
    full_description: 'Craft HTTP requests, mock server responses, simulate latency, and run automated smoke tests locally. RestForge guarantees that your private test credentials never leave your local encrypted keystore without your explicit permission.',
    version: '1.9.5',
    category_id: 'cat-devops',
    category_name: 'Developer & DevOps Tools',
    platform: 'Cross-Platform',
    system_requirements: 'Any modern 64-bit OS. 2GB RAM minimum, 250MB storage.',
    is_paid: false,
    price: 0,
    currency: 'USD',
    developer_name: 'Forge API Systems',
    developer_url: 'https://restforge.dev',
    thumbnail_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    ],
    download_url: 'https://drive.google.com/file/d/1X9mK5pL2-restforge-studio-installer/view?usp=sharing',
    download_count: 675,
    is_published: true,
    is_featured: false,
    seo_title: 'RestForge API Studio — Modern Offline API Testing Tool',
    seo_description: 'Fast, secure, offline-first client for REST and GraphQL APIs.',
    created_at: '2026-01-20T11:15:00Z',
    updated_at: '2026-02-28T09:40:00Z',
  },
  {
    id: 'soft-jetbrains-ent',
    title: 'Polyglot Studio Enterprise',
    slug: 'polyglot-studio-enterprise',
    short_description: 'Commercial enterprise IDE suite featuring deep AST static analysis, memory profiling, and refactoring.',
    full_description: 'Polyglot Studio Enterprise is built for large codebases requiring cross-module type inference, automated safety audits, database SQL introspection, and distributed profiling. Licensable for enterprise teams.',
    version: '2026.1',
    category_id: 'cat-devops',
    category_name: 'Developer & DevOps Tools',
    platform: 'Cross-Platform',
    system_requirements: '16GB RAM recommended, 4GB SSD space, multi-core 64-bit processor.',
    is_paid: true,
    price: 199.00,
    currency: 'USD',
    developer_name: 'Polyglot IDE Systems Inc.',
    developer_url: 'https://polyglot-studio.com',
    thumbnail_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
    ],
    download_url: '', // Private / Gated
    download_count: 140,
    is_published: true,
    is_featured: true,
    seo_title: 'Polyglot Studio Enterprise — High-End Development Environment',
    seo_description: 'Commercial enterprise IDE with AST refactoring and full memory profiling.',
    created_at: '2026-01-10T14:00:00Z',
    updated_at: '2026-03-02T16:20:00Z',
  },
  {
    id: 'soft-blender-suite',
    title: 'ChromaRender 3D Studio',
    slug: 'chromarender-3d-studio',
    short_description: 'Comprehensive 3D mesh sculpting, real-time path tracing, and procedural shader suite.',
    full_description: 'An open creative pipeline for visual effects artists, game animators, and industrial product designers. Features a non-destructive geometry node graph, GPU-accelerated ray tracing viewport, and production-ready alembic/USD asset export pipelines.',
    version: '4.2.0',
    category_id: 'cat-creative',
    category_name: 'Design, Creative & Video Software',
    platform: 'Cross-Platform',
    system_requirements: 'Vulkan or Metal capable GPU with 6GB+ VRAM, 16GB System RAM, 2GB disk space.',
    is_paid: false,
    price: 0,
    currency: 'USD',
    developer_name: 'Open 3D Foundation',
    developer_url: 'https://open3d.art',
    thumbnail_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80',
    ],
    download_url: 'https://drive.google.com/file/d/1N3mB7_chromarender_3d_v42/view?usp=sharing',
    download_count: 1850,
    is_published: true,
    is_featured: true,
    seo_title: 'ChromaRender 3D Studio — Open-Source 3D Creation Pipeline',
    seo_description: 'Free download for 3D modeling, sculpting, and real-time GPU rendering.',
    created_at: '2026-01-05T09:00:00Z',
    updated_at: '2026-03-05T15:30:00Z',
  },
  {
    id: 'soft-vector-artisan',
    title: 'VectorArtisan Pro',
    slug: 'vectorartisan-pro',
    short_description: 'Precision vector graphics and icon design suite with sub-pixel curve snapping.',
    full_description: 'VectorArtisan Pro provides illustrators and UI designers with real-time boolean operations, parametric gradient meshes, CMYK print export, and automated SVG optimization. Zero subscriptions for the creative professional.',
    version: '3.0.2',
    category_id: 'cat-creative',
    category_name: 'Design, Creative & Video Software',
    platform: 'macOS & Windows',
    system_requirements: 'macOS 11+ or Windows 10 x64. 4GB RAM, 800MB storage.',
    is_paid: false,
    price: 0,
    currency: 'USD',
    developer_name: 'Artisan Visuals UK',
    developer_url: 'https://vectorartisan.design',
    thumbnail_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=80',
    ],
    download_url: 'https://drive.google.com/file/d/1Z4uY8-vectorartisan-v302/view?usp=sharing',
    download_count: 730,
    is_published: true,
    is_featured: false,
    seo_title: 'VectorArtisan Pro — Precision Vector Graphics Editor',
    seo_description: 'Download VectorArtisan Pro for high-precision illustration and UI icon design.',
    created_at: '2026-01-28T12:00:00Z',
    updated_at: '2026-02-25T11:00:00Z',
  },
  {
    id: 'soft-cinema-cut',
    title: 'HyperCut Cinema Suite',
    slug: 'hypercut-cinema-suite',
    short_description: 'Commercial 8K timeline video editor with GPU color grading and spatial surround audio mixing.',
    full_description: 'Designed for boutique film studios and broadcast commercial editors. HyperCut delivers multi-camera synchronization, hardware ProRes and AV1 encoding, and deep DaVinci-compatible XML project round-tripping.',
    version: '5.0.1',
    category_id: 'cat-creative',
    category_name: 'Design, Creative & Video Software',
    platform: 'macOS & Windows',
    system_requirements: 'Dedicated 8GB+ GPU, 32GB RAM, NVMe scratch disk.',
    is_paid: true,
    price: 249.00,
    currency: 'USD',
    developer_name: 'HyperCut Media Systems',
    developer_url: 'https://hypercut.video',
    thumbnail_url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=1200&q=80',
    ],
    download_url: '', // Gated
    download_count: 95,
    is_published: true,
    is_featured: false,
    seo_title: 'HyperCut Cinema Suite — Professional 8K Video Editing Suite',
    seo_description: 'Enterprise grade non-linear video editing for high-end film production.',
    created_at: '2026-02-10T16:00:00Z',
    updated_at: '2026-03-01T10:00:00Z',
  },
  {
    id: 'soft-obsidian-notes',
    title: 'NeuroGraph Notes',
    slug: 'neurograph-notes',
    short_description: 'Local-first networked markdown knowledge graph with bidirectional wikilinks and canvas boards.',
    full_description: 'NeuroGraph stores all your thoughts, engineering schematics, and project specifications in plain Markdown files on your hard drive. Never worry about proprietary lock-in. Visualize your knowledge hierarchy in an interactive 3D force-directed graph node explorer.',
    version: '1.6.8',
    category_id: 'cat-productivity',
    category_name: 'Productivity & Office Suites',
    platform: 'Cross-Platform',
    system_requirements: 'Windows 10+, macOS Monterey+, or Linux. 2GB RAM.',
    is_paid: false,
    price: 0,
    currency: 'USD',
    developer_name: 'Cognitive Web Labs',
    developer_url: 'https://neurograph.md',
    thumbnail_url: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
    ],
    download_url: 'https://github.com/cognitiveweb/neurograph/releases/download/v1.6.8/NeuroGraph-Setup.exe',
    download_count: 2410,
    is_published: true,
    is_featured: true,
    seo_title: 'Download NeuroGraph Notes — Private Second Brain for Developers',
    seo_description: 'Free offline markdown note taking and visual knowledge graph software.',
    created_at: '2026-01-02T10:00:00Z',
    updated_at: '2026-03-06T18:00:00Z',
  },
  {
    id: 'soft-sheet-matrix',
    title: 'MatrixSheet Pro',
    slug: 'matrixsheet-pro',
    short_description: 'High-speed spreadsheet calculating millions of rows locally with Python and SQL extensions.',
    full_description: 'MatrixSheet Pro eliminates the 1,000,000 row bottleneck of traditional spreadsheet applications. Run in-memory DuckDB queries directly on CSV, Parquet, and Excel files with zero cloud latency.',
    version: '2.2.0',
    category_id: 'cat-productivity',
    category_name: 'Productivity & Office Suites',
    platform: 'Windows & macOS',
    system_requirements: '64-bit OS, 4GB RAM minimum.',
    is_paid: false,
    price: 0,
    currency: 'USD',
    developer_name: 'Tabular Analytics Inc.',
    developer_url: 'https://matrixsheet.io',
    thumbnail_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    ],
    download_url: 'https://drive.google.com/file/d/1K7xP3-matrixsheet-setup/view?usp=sharing',
    download_count: 810,
    is_published: true,
    is_featured: false,
    seo_title: 'MatrixSheet Pro — Multi-Million Row Local Spreadsheet',
    seo_description: 'High-speed local spreadsheet engine supporting SQL queries and Python formulas.',
    created_at: '2026-01-18T14:30:00Z',
    updated_at: '2026-02-27T17:00:00Z',
  },
  {
    id: 'soft-wireguard-shield',
    title: 'AegisTunnel VPN & Guard',
    slug: 'aegistunnel-vpn-guard',
    short_description: 'Modern WireGuard protocol client with DNS leak prevention and kill switch architecture.',
    full_description: 'AegisTunnel provides secure, kernel-level encryption tunnels with zero tracking logs. Featuring automated server hopping, split tunneling per application, and comprehensive DNS over HTTPS protection.',
    version: '1.4.3',
    category_id: 'cat-security',
    category_name: 'Security, Privacy & System Utilities',
    platform: 'Cross-Platform',
    system_requirements: 'Windows 10/11, macOS 12+, Ubuntu 20.04+, or Android/iOS.',
    is_paid: false,
    price: 0,
    currency: 'USD',
    developer_name: 'Aegis Security Project',
    developer_url: 'https://aegistunnel.org',
    thumbnail_url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    ],
    download_url: 'https://drive.google.com/file/d/1Q4zR9-aegistunnel-setup/view?usp=sharing',
    download_count: 2190,
    is_published: true,
    is_featured: true,
    seo_title: 'AegisTunnel VPN — Fast, Open WireGuard Client',
    seo_description: 'Free download of AegisTunnel VPN. Private, high-speed, open-source connection protection.',
    created_at: '2026-01-08T08:00:00Z',
    updated_at: '2026-03-03T11:20:00Z',
  },
  {
    id: 'soft-cipher-vault',
    title: 'CipherKeep Vault Pro',
    slug: 'cipherkeep-vault-pro',
    short_description: 'Zero-knowledge encrypted password and developer secret manager with Argon2id hashing.',
    full_description: 'Store database credentials, SSH key pairs, and personal authentication tokens with end-to-end client encryption. Includes automatic password generator, breach surveillance checker, and offline emergency kit generation.',
    version: '3.5.0',
    category_id: 'cat-security',
    category_name: 'Security, Privacy & System Utilities',
    platform: 'Cross-Platform',
    system_requirements: 'Any modern OS. 256MB RAM.',
    is_paid: false,
    price: 0,
    currency: 'USD',
    developer_name: 'CipherKeep Security Lab',
    developer_url: 'https://cipherkeep.org',
    thumbnail_url: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=600&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
    ],
    download_url: 'https://github.com/cipherkeep/vault/releases/download/v3.5.0/CipherKeep-Universal.zip',
    download_count: 1540,
    is_published: true,
    is_featured: false,
    seo_title: 'CipherKeep Vault — Open Zero-Knowledge Password Vault',
    seo_description: 'Secure, offline-first vault for passwords, 2FA tokens, and SSH keys.',
    created_at: '2026-01-12T13:00:00Z',
    updated_at: '2026-02-20T10:00:00Z',
  },
  {
    id: 'soft-clean-architect',
    title: 'CleanArchitect System Suite',
    slug: 'cleanarchitect-system-suite',
    short_description: 'Commercial deep storage cleaner, application dependency uninstaller, and disk bloat analyzer.',
    full_description: 'CleanArchitect inspects your system for orphan caches, dead package manager dependencies, duplicate binary blobs, and background daemons slowing down your machine. Includes disk heatmap visualizer.',
    version: '4.8.0',
    category_id: 'cat-security',
    category_name: 'Security, Privacy & System Utilities',
    platform: 'macOS & Windows',
    system_requirements: 'macOS 12+ or Windows 10/11. 2GB RAM.',
    is_paid: true,
    price: 49.95,
    currency: 'USD',
    developer_name: 'CleanArchitect Software',
    developer_url: 'https://cleanarchitect.io',
    thumbnail_url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    ],
    download_url: '', // Gated
    download_count: 310,
    is_published: true,
    is_featured: false,
    seo_title: 'CleanArchitect System Suite — Deep System Cleaner',
    seo_description: 'System cleanup and performance optimizer for modern development workstations.',
    created_at: '2026-02-05T09:30:00Z',
    updated_at: '2026-03-04T14:10:00Z',
  },
];

const INITIAL_ADS: AdSetting[] = [
  {
    id: 'ad-hp-top',
    slot_key: 'homepage_top',
    slot_name: 'Homepage Top Header Banner',
    is_enabled: true,
    ad_type: 'banner_728x90',
    zone_id: 'demo_adsterra_top_728',
    ad_script: '/* Adsterra 728x90 Standard Display */',
    updated_at: '2026-03-01T12:00:00Z',
  },
  {
    id: 'ad-hp-middle',
    slot_key: 'homepage_middle',
    slot_name: 'Homepage Middle Showcase Banner',
    is_enabled: true,
    ad_type: 'banner_728x90',
    zone_id: 'demo_adsterra_mid_728',
    ad_script: '/* Adsterra 728x90 Showcase Unit */',
    updated_at: '2026-03-01T12:00:00Z',
  },
  {
    id: 'ad-hp-bottom',
    slot_key: 'homepage_bottom',
    slot_name: 'Homepage Pre-Footer Banner',
    is_enabled: true,
    ad_type: 'banner_728x90',
    zone_id: 'demo_adsterra_bot_728',
    ad_script: '/* Adsterra 728x90 Bottom Banner */',
    updated_at: '2026-03-01T12:00:00Z',
  },
  {
    id: 'ad-details-sidebar',
    slot_key: 'software_details',
    slot_name: 'Software Details Sidebar Unit',
    is_enabled: true,
    ad_type: 'banner_300x250',
    zone_id: 'demo_adsterra_det_300',
    ad_script: '/* Adsterra 300x250 Medium Rectangle */',
    updated_at: '2026-03-01T12:00:00Z',
  },
  {
    id: 'ad-sidebar',
    slot_key: 'sidebar',
    slot_name: 'Global Sidebar Placement',
    is_enabled: false,
    ad_type: 'banner_300x250',
    zone_id: '',
    ad_script: '',
    updated_at: '2026-03-01T12:00:00Z',
  },
  {
    id: 'ad-footer',
    slot_key: 'footer',
    slot_name: 'Sticky Footer Display Bar',
    is_enabled: false,
    ad_type: 'banner_728x90',
    zone_id: '',
    ad_script: '',
    updated_at: '2026-03-01T12:00:00Z',
  },
];

const INITIAL_SITE_SETTINGS: SiteSettings = {
  site_name: 'Software Engineer',
  hero_headline: 'Discover the Best Software for Your Needs',
  hero_subheadline: 'Vetted developer tools, productivity suites, system utilities, and creative software with verified high-speed downloads.',
  contact_email: 'contact@softwareengineer.dev',
  social_github: 'https://github.com',
  social_twitter: 'https://x.com',
  default_theme: 'system',
};

const INITIAL_DOWNLOADS: DownloadRecord[] = [
  {
    id: 'dl-1',
    software_id: 'soft-vscode',
    software_title: 'CodeSphere IDE',
    software_version: '2.4.1',
    software_thumbnail: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    user_id: 'usr-demo-engineer',
    user_email: 'alex.engineer@example.com',
    download_date: '2026-03-08T14:32:00Z',
  },
  {
    id: 'dl-2',
    software_id: 'soft-obsidian-notes',
    software_title: 'NeuroGraph Notes',
    software_version: '1.6.8',
    software_thumbnail: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=80',
    user_id: 'usr-demo-engineer',
    user_email: 'alex.engineer@example.com',
    download_date: '2026-03-09T09:15:00Z',
  },
  {
    id: 'dl-3',
    software_id: 'soft-wireguard-shield',
    software_title: 'AegisTunnel VPN & Guard',
    software_version: '1.4.3',
    software_thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80',
    user_id: 'usr-sarah-designer',
    user_email: 'sarah.creative@example.com',
    download_date: '2026-03-10T11:45:00Z',
  },
];

const INITIAL_USERS: Profile[] = [
  {
    id: 'usr-admin-root',
    email: 'admin@softwareengineer.dev',
    full_name: 'Lead System Architect',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    bio: 'Platform administrator and software marketplace curator.',
    status: 'active',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-03-01T00:00:00Z',
  },
  {
    id: 'usr-demo-engineer',
    email: 'alex.engineer@example.com',
    full_name: 'Alex Rivera',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    bio: 'Full-stack software engineer & open-source contributor.',
    status: 'active',
    created_at: '2026-01-15T10:00:00Z',
    updated_at: '2026-03-02T12:00:00Z',
  },
  {
    id: 'usr-sarah-designer',
    email: 'sarah.creative@example.com',
    full_name: 'Sarah Chen',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    bio: 'Product designer and 3D visual artist.',
    status: 'active',
    created_at: '2026-02-01T14:00:00Z',
    updated_at: '2026-02-28T16:00:00Z',
  },
];

// Helper to interact with local storage store
function getLocalItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(`se_store_${key}`);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setLocalItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`se_store_${key}`, JSON.stringify(value));
  } catch (err) {
    console.error('Storage write error', err);
  }
}

// Unified Data Access Class
export class DataService {
  // Software Operations
  static async getSoftwareList(): Promise<Software[]> {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('software')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          return data as Software[];
        }
      } catch (err) {
        console.warn('Supabase query failed, falling back to local store:', err);
      }
    }
    return getLocalItem<Software[]>('software', INITIAL_SOFTWARE);
  }

  static async getSoftwareBySlug(slug: string): Promise<Software | null> {
    const list = await this.getSoftwareList();
    return list.find((item) => item.slug === slug) || null;
  }

  static async saveSoftware(software: Partial<Software> & { title: string; category_id: string }): Promise<Software> {
    const supabase = getSupabaseClient();
    const categories = await this.getCategories();
    const cat = categories.find((c) => c.id === software.category_id);
    const category_name = cat ? cat.name : 'General';

    const slug = software.slug || software.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const now = new Date().toISOString();

    const prepared: Software = {
      id: software.id || `soft-${Date.now()}`,
      title: software.title,
      slug,
      short_description: software.short_description || '',
      full_description: software.full_description || '',
      version: software.version || '1.0.0',
      category_id: software.category_id,
      category_name,
      platform: software.platform || 'Cross-Platform',
      system_requirements: software.system_requirements || 'Standard 64-bit OS with modern hardware.',
      is_paid: Boolean(software.is_paid),
      price: software.price ? Number(software.price) : 0,
      currency: software.currency || 'USD',
      developer_name: software.developer_name || 'Independent Developer',
      developer_url: software.developer_url || '',
      thumbnail_url: software.thumbnail_url || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
      screenshots: software.screenshots && software.screenshots.length > 0 ? software.screenshots : [software.thumbnail_url || ''],
      download_url: software.download_url || '',
      download_count: software.download_count ?? 0,
      is_published: software.is_published ?? true,
      is_featured: Boolean(software.is_featured),
      seo_title: software.seo_title || `${software.title} — Official Download`,
      seo_description: software.seo_description || software.short_description,
      created_at: software.created_at || now,
      updated_at: now,
    };

    if (supabase) {
      try {
        const { data, error } = await supabase.from('software').upsert(prepared).select().single();
        if (!error && data) {
          // Sync local cache
          const localList = getLocalItem<Software[]>('software', INITIAL_SOFTWARE);
          const index = localList.findIndex((s) => s.id === prepared.id);
          if (index >= 0) localList[index] = data as Software;
          else localList.unshift(data as Software);
          setLocalItem('software', localList);
          return data as Software;
        }
      } catch (err) {
        console.warn('Supabase upsert failed, saving to local store:', err);
      }
    }

    const localList = getLocalItem<Software[]>('software', INITIAL_SOFTWARE);
    const index = localList.findIndex((s) => s.id === prepared.id);
    if (index >= 0) {
      localList[index] = prepared;
    } else {
      localList.unshift(prepared);
    }
    setLocalItem('software', localList);
    return prepared;
  }

  static async deleteSoftware(id: string): Promise<boolean> {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('software').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete error:', err);
      }
    }
    const localList = getLocalItem<Software[]>('software', INITIAL_SOFTWARE);
    const filtered = localList.filter((s) => s.id !== id);
    setLocalItem('software', filtered);
    return true;
  }

  // Category Operations
  static async getCategories(): Promise<Category[]> {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('display_order', { ascending: true });
        if (!error && data && data.length > 0) {
          return data as Category[];
        }
      } catch (err) {
        console.warn('Supabase categories fetch error:', err);
      }
    }
    return getLocalItem<Category[]>('categories', INITIAL_CATEGORIES);
  }

  static async saveCategory(cat: Partial<Category> & { name: string }): Promise<Category> {
    const slug = cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const prepared: Category = {
      id: cat.id || `cat-${Date.now()}`,
      name: cat.name,
      slug,
      description: cat.description || '',
      icon: cat.icon || 'Folder',
      display_order: cat.display_order ?? 99,
      software_count: cat.software_count ?? 0,
    };

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('categories').upsert(prepared).select().single();
        if (!error && data) {
          const list = getLocalItem<Category[]>('categories', INITIAL_CATEGORIES);
          const idx = list.findIndex((c) => c.id === prepared.id);
          if (idx >= 0) list[idx] = data as Category;
          else list.push(data as Category);
          setLocalItem('categories', list);
          return data as Category;
        }
      } catch (err) {
        console.warn('Supabase category upsert error:', err);
      }
    }

    const list = getLocalItem<Category[]>('categories', INITIAL_CATEGORIES);
    const idx = list.findIndex((c) => c.id === prepared.id);
    if (idx >= 0) list[idx] = prepared;
    else list.push(prepared);
    setLocalItem('categories', list);
    return prepared;
  }

  static async deleteCategory(id: string): Promise<boolean> {
    const list = getLocalItem<Category[]>('categories', INITIAL_CATEGORIES);
    const filtered = list.filter((c) => c.id !== id);
    setLocalItem('categories', filtered);
    return true;
  }

  // Download System (Secure verification & record creation)
  static async executeDownload(
    softwareId: string,
    user?: AuthUser | null
  ): Promise<{ success: boolean; downloadUrl?: string; error?: string }> {
    const softwareList = await this.getSoftwareList();
    const software = softwareList.find((s) => s.id === softwareId);

    if (!software) {
      return { success: false, error: 'Software not found.' };
    }

    if (!software.is_published) {
      return { success: false, error: 'This software is not currently published.' };
    }

    if (software.is_paid) {
      return {
        success: false,
        error: 'This software requires a commercial license. Payment checkout is coming soon!',
      };
    }

    if (!software.download_url) {
      return { success: false, error: 'Download mirror is currently being updated. Please check back shortly.' };
    }

    // Increment download count
    software.download_count = (software.download_count || 0) + 1;
    await this.saveSoftware(software);

    // Record download event in telemetry table
    const downloadRecord: DownloadRecord = {
      id: `dl-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      software_id: software.id,
      software_title: software.title,
      software_version: software.version,
      software_thumbnail: software.thumbnail_url,
      user_id: user?.id || 'guest',
      user_email: user?.email || 'guest@anonymous.net',
      download_date: new Date().toISOString(),
    };

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('downloads').insert({
          software_id: downloadRecord.software_id,
          user_id: user ? user.id : null,
          download_date: downloadRecord.download_date,
        });
      } catch (err) {
        console.warn('Supabase download logging error:', err);
      }
    }

    const currentDownloads = getLocalItem<DownloadRecord[]>('downloads', INITIAL_DOWNLOADS);
    currentDownloads.unshift(downloadRecord);
    setLocalItem('downloads', currentDownloads);

    return {
      success: true,
      downloadUrl: software.download_url,
    };
  }

  static async getDownloadsHistory(userId?: string): Promise<DownloadRecord[]> {
    const supabase = getSupabaseClient();
    if (supabase && userId) {
      try {
        const { data, error } = await supabase
          .from('downloads')
          .select('*, software(title, version, thumbnail_url)')
          .eq('user_id', userId)
          .order('download_date', { ascending: false });
        if (!error && data) {
          return data.map((d: any) => ({
            id: d.id,
            software_id: d.software_id,
            software_title: d.software?.title || 'Software',
            software_version: d.software?.version || '1.0.0',
            software_thumbnail: d.software?.thumbnail_url || '',
            user_id: d.user_id,
            download_date: d.download_date,
          }));
        }
      } catch (err) {
        console.warn('Supabase downloads fetch error:', err);
      }
    }

    const all = getLocalItem<DownloadRecord[]>('downloads', INITIAL_DOWNLOADS);
    if (userId) {
      return all.filter((d) => d.user_id === userId);
    }
    return all;
  }

  // Adsterra Ads Configuration
  static async getAdsSettings(): Promise<AdSetting[]> {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('ads_settings').select('*');
        if (!error && data && data.length > 0) {
          return data as AdSetting[];
        }
      } catch (err) {
        console.warn('Supabase ads fetch error:', err);
      }
    }
    return getLocalItem<AdSetting[]>('ads_settings', INITIAL_ADS);
  }

  static async updateAdSetting(slotKey: string, updates: Partial<AdSetting>): Promise<AdSetting> {
    const ads = await this.getAdsSettings();
    const index = ads.findIndex((a) => a.slot_key === slotKey);
    if (index === -1) throw new Error('Ad slot not found');

    const updated: AdSetting = {
      ...ads[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    ads[index] = updated;

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('ads_settings').upsert(updated);
      } catch (err) {
        console.warn('Supabase ad update error:', err);
      }
    }

    setLocalItem('ads_settings', ads);
    return updated;
  }

  // Site Settings
  static async getSiteSettings(): Promise<SiteSettings> {
    return getLocalItem<SiteSettings>('site_settings', INITIAL_SITE_SETTINGS);
  }

  static async updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    const current = await this.getSiteSettings();
    const updated = { ...current, ...settings };
    setLocalItem('site_settings', updated);
    return updated;
  }

  // User Management
  static async getUsers(): Promise<Profile[]> {
    return getLocalItem<Profile[]>('profiles', INITIAL_USERS);
  }

  static async toggleUserStatus(userId: string): Promise<Profile | null> {
    const users = await this.getUsers();
    const target = users.find((u) => u.id === userId);
    if (!target) return null;

    target.status = target.status === 'active' ? 'suspended' : 'active';
    target.updated_at = new Date().toISOString();
    setLocalItem('profiles', users);
    return target;
  }

  // Reset to Factory Seed Data
  static resetToDefaults(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('se_store_software');
    localStorage.removeItem('se_store_categories');
    localStorage.removeItem('se_store_ads_settings');
    localStorage.removeItem('se_store_downloads');
    localStorage.removeItem('se_store_site_settings');
    localStorage.removeItem('se_store_profiles');
  }
}
