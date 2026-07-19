export const StandardsData = [
    {
        id: "80211b",
        title: "802.11b — Wi‑Fi 1",
        badges: [
            { label: "1999", className: "badge-year" },
            { label: "2.4 GHz", className: "badge-24" },
            { label: "11 Mbps max", className: "badge-speed" },
        ],
        p1: `The first Wi‑Fi standard released for worldwide commercial use. 802.11b operates on the 2.4 GHz ISM band with a 22 MHz channel bandwidth, using Complementary Code Keying (CCK) — a complex M‑ary orthogonal coding scheme. Its maximum theoretical throughput is 11 Mbps, with fallbacks to 5.5, 2, and 1 Mbps under poor signal conditions.`,
        p2: `In practice, real‑world throughput rarely exceeded 4–5 Mbps. The 2.4 GHz band, shared with other consumer electronics, caused persistent interference issues that made performance in populated environments unreliable.`,
    },
    {
        id: "80211a",
        title: "802.11a — Wi‑Fi 2",
        badges: [
            { label: "1999", className: "badge-year" },
            { label: "5 GHz", className: "badge-5" },
            { label: "54 Mbps max", className: "badge-speed" },
        ],
        p1: `Released the same year as 802.11b but far less widely adopted, 802.11a operated on the 5 GHz band using OFDM (Orthogonal Frequency Division Multiplexing), achieving a theoretical maximum of 54 Mbps. The higher frequency offered less interference and more bandwidth, with typical real‑world speeds of around 20–25 Mbps.`,
        p2: `The tradeoff was significant: shorter range and notably worse wall penetration compared to 802.11b. Combined with higher hardware costs and incompatibility with the 802.11b ecosystem, 802.11a saw limited consumer adoption.`,
    },
    {
        id: "80211g",
        title: "802.11g — Wi‑Fi 3",
        badges: [
            { label: "2003", className: "badge-year" },
            { label: "2.4 GHz", className: "badge-24" },
            { label: "54 Mbps max", className: "badge-speed" },
        ],
        p1: `802.11g took the best of both predecessors: it adopted OFDM from 802.11a for higher throughput (54 Mbps theoretical) while staying on the 2.4 GHz band for broader range and backward compatibility with 802.11b hardware. Real‑world speeds typically landed between 20–25 Mbps.`,
        p2: `It became the dominant standard for home and office use throughout the mid‑2000s, largely because it offered a meaningful speed improvement without forcing users to replace existing 802.11b hardware.`,
    },
    {
        id: "80211n",
        title: "802.11n — Wi‑Fi 4",
        badges: [
            { label: "2009", className: "badge-year" },
            { label: "Dual‑band", className: "badge-dual" },
            { label: "600 Mbps max", className: "badge-speed" },
        ],
        p1: `The first standard considered genuinely capable for demanding commercial environments. 802.11n introduced MIMO (Multiple Input Multiple Output), using multiple antennas on both the transmitter and receiver to send and receive data streams simultaneously. Combined with support for both 2.4 GHz and 5 GHz bands and optional 40 MHz channel bonding, the theoretical maximum reached 600 Mbps.`,
        p2: `In practice, most consumer hardware delivered 50–150 Mbps, depending on the number of spatial streams and band in use. MIMO was a foundational shift — every subsequent generation has built upon it.`,
    },
    {
        id: "80211ac",
        title: "802.11ac — Wi‑Fi 5",
        badges: [
            { label: "2013", className: "badge-year" },
            { label: "5 GHz", className: "badge-5" },
            { label: "3.5 Gbps max", className: "badge-speed" },
        ],
        p1: `The first Wi‑Fi standard to deliver gigabit‑class speeds, 802.11ac operates exclusively on the 5 GHz band. It expanded channel widths to 80 MHz (optionally 160 MHz) and introduced Multi‑User MIMO (MU‑MIMO), allowing a router to communicate with multiple clients simultaneously rather than serving them in sequence.`,
        p2: `Theoretical maximum throughput reached 3.5 Gbps across multiple streams; typical real‑world performance for a single device ranged from 200–500 Mbps under good conditions. The 5 GHz‑only approach kept speeds high but limited range relative to dual‑band alternatives.`,
    },
    {
        id: "80211ax",
        title: "802.11ax — Wi‑Fi 6 and 6E",
        badges: [
            { label: "2019 / 2021", className: "badge-year" },
            { label: "Dual‑band", className: "badge-dual" },
            { label: "+ 6 GHz", className: "badge-6" },
            { label: "9.6 Gbps max", className: "badge-speed" },
        ],
        p1: `802.11ax introduced OFDMA (Orthogonal Frequency Division Multiple Access), which allows a single transmission to carry data for multiple clients at once by subdividing channels into smaller resource units. Combined with reduced subcarrier spacing (78.125 kHz), schedule‑based resource allocation, and improved MU‑MIMO, Wi‑Fi 6 is purpose‑built for dense environments.`,
        p2: `Its extension, Wi‑Fi 6E, opened the 6 GHz band — adding up to 1,200 MHz of fresh, uncongested spectrum. Theoretical maximum sits at 9.6 Gbps; real‑world speeds of 500–900 Mbps are common on well‑configured networks, with the 6 GHz band offering the highest throughput in close range.`,
    },
    {
        id: "80211be",
        title: "802.11be — Wi‑Fi 7",
        badges: [
            { label: "Present", className: "badge-year" },
            { label: "Tri‑band", className: "badge-dual" },
            { label: "46 Gbps max", className: "badge-speed" },
        ],
        p1: `The current frontier. Wi‑Fi 7 is backward compatible with Wi‑Fi 6E and operates across all three bands simultaneously using Multi‑Link Operation (MLO) — allowing a single device to transmit and receive across multiple bands and channels at the same time, reducing latency and increasing effective throughput.`,
        p2: `Other introductions include 320 MHz channel widths, 4096‑QAM modulation (up from 1024‑QAM in Wi‑Fi 6), and theoretical speeds up to 46 Gbps. Real‑world performance data is still emerging as hardware deployments ramp up, but early testing shows substantial gains in both throughput and latency over Wi‑Fi 6E.`,
    },
];