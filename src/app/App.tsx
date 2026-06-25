import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "motion/react";
import {
  Shield, Network, Monitor, Download, Mail, Phone, MapPin,
  Linkedin, Github, ChevronDown, Menu, X, Award, GraduationCap,
  Activity, MessageSquare, ArrowRight, Cloud, Zap, Users,
  Globe, Eye, Star, CheckCircle, Lock,
} from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import profilePhoto from "@/imports/IMG-20260425-WA0106.png";

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface Experience {
  title: string;
  company: string;
  period: string;
  highlights: string[];
}

interface Project {
  title: string;
  description: string;
  tags: string[];
  fullDescription: string;
  challenges: string[];
  outcomes: string[];
}

// ─── DATA ────────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Education", href: "#education" },
  { label: "Certifications", href: "#certifications" },
  { label: "Contact", href: "#contact" },
];

const SKILL_CATEGORIES = [
  {
    title: "Network Design & Administration",
    icon: Network,
    color: "#2563EB",
    skills: ["Cisco Routers & Switches", "Routing & Switching", "VLANs", "VPNs", "Network Troubleshooting"],
  },
  {
    title: "Cybersecurity & VPN Solutions",
    icon: Shield,
    color: "#8B5CF6",
    skills: ["FortiGate Firewalls", "Palo Alto Appliances", "SSL VPN", "FortiClient", "Secure Remote Access"],
  },
  {
    title: "Virtualization & Cloud",
    icon: Cloud,
    color: "#22D3EE",
    skills: ["Proxmox VE", "VM Hosting", "VM Lifecycle Management", "Web App Hosting"],
  },
  {
    title: "Monitoring & Alerting",
    icon: Activity,
    color: "#10B981",
    skills: ["Prometheus", "Grafana", "Gmail Alert Integration", "Real-Time Monitoring"],
  },
  {
    title: "IT Support & Documentation",
    icon: Monitor,
    color: "#F59E0B",
    skills: ["Technical Documentation", "IT Consulting", "Computer Maintenance", "Hardware Support", "Client Support"],
  },
];

const TECH_STACK = [
  { name: "Cisco IOS", abbr: "CI", color: "#1BA0E2" },
  { name: "FortiGate", abbr: "FG", color: "#EE3124" },
  { name: "Palo Alto", abbr: "PA", color: "#FA582D" },
  { name: "Proxmox VE", abbr: "PX", color: "#E57000" },
  { name: "Prometheus", abbr: "PM", color: "#E6522C" },
  { name: "Grafana", abbr: "GF", color: "#F46800" },
  { name: "HTML", abbr: "HT", color: "#E34F26" },
  { name: "CSS", abbr: "CS", color: "#1572B6" },
  { name: "C Basics", abbr: "C ", color: "#A8B9CC" },
  { name: "WordPress", abbr: "WP", color: "#21759B" },
  { name: "MS Office", abbr: "MS", color: "#D83B01" },
  { name: "GitHub", abbr: "GH", color: "#9d7dd6" },
];

const EXPERIENCES: Experience[] = [
  {
    title: "IT Engineer",
    company: "ETS NTECH, Yaoundé",
    period: "2024 – Present",
    highlights: [
      "Designed and deployed enterprise networking solutions using Cisco routers and switches.",
      "Implemented security architectures with FortiGate firewalls and Palo Alto appliances.",
      "Built Proxmox-based virtualization environments to host enterprise web applications.",
      "Delivered teleworking solutions with SSL VPN and FortiClient.",
      "Deployed Prometheus and Grafana monitoring systems with Gmail integration for real-time alerts.",
      "Provided IT consulting and tailored solutions ensuring scalability and security.",
    ],
  },
  {
    title: "Networking Intern",
    company: "ETS NTECH, Yaoundé",
    period: "2023 · 11 weeks",
    highlights: [
      "Gained hands-on experience in Cisco networking and administration.",
      "Assisted in web design projects and collaborative coding using GitHub.",
      "Performed computer maintenance and troubleshooting.",
      "Supported digital marketing and IT communication initiatives.",
    ],
  },
  {
    title: "Sales Representative",
    company: "Orange Cameroon, Douala",
    period: "2022 · 12 weeks",
    highlights: [
      "Assisted customers with SIM registration and ISP services.",
      "Promoted and supported Orange's digital solutions.",
    ],
  },
];

const PROJECTS: Project[] = [
  {
    title: "Enterprise Network Deployment",
    description:
      "Designed and deployed scalable network infrastructure using Cisco routers and switches for business environments.",
    tags: ["Cisco", "Routing", "Switching", "VLANs", "Network Design"],
    fullDescription:
      "Led the end-to-end design and deployment of a scalable enterprise network for a business environment spanning multiple departments. Configured Cisco routers and switches to support high availability, redundancy, and secure inter-VLAN routing. Implemented structured cabling, subnetting, and access control lists to ensure segmented and secure communication across the infrastructure.",
    challenges: [
      "Integrating legacy hardware with modern switching architecture",
      "Ensuring zero-downtime migration for critical business systems",
      "Designing a VLAN scheme that balanced security with operational simplicity",
    ],
    outcomes: [
      "Reduced network downtime by 40% through redundant link design",
      "Improved internal communication speed across departments",
      "Established a scalable foundation supporting 200+ concurrent endpoints",
    ],
  },
  {
    title: "Secure Teleworking Solution",
    description:
      "Implemented secure remote access using SSL VPN and FortiClient to support controlled access to internal systems.",
    tags: ["FortiGate", "SSL VPN", "FortiClient", "Cybersecurity"],
    fullDescription:
      "Designed and deployed a secure remote access solution enabling employees to safely connect to corporate resources from external locations. Leveraged FortiGate firewalls and SSL VPN tunnels, paired with FortiClient endpoint software, to enforce identity verification, device compliance checks, and encrypted data transmission.",
    challenges: [
      "Maintaining strong security posture without degrading user experience",
      "Supporting a mixed device fleet including Windows, macOS, and mobile platforms",
      "Preventing unauthorized access while ensuring seamless connectivity for distributed teams",
    ],
    outcomes: [
      "Enabled secure remote access for 50+ employees",
      "Blocked 99.8% of unauthorized connection attempts via firewall policy enforcement",
      "Achieved zero security incidents during the first six months of operation",
    ],
  },
  {
    title: "Virtualized Hosting Environment",
    description:
      "Built Proxmox-based virtualization environments for hosting enterprise web applications and managing VM lifecycle.",
    tags: ["Proxmox", "Virtualization", "VM Hosting", "Infrastructure"],
    fullDescription:
      "Built a Proxmox VE-based virtualization platform to host and manage enterprise web applications with high availability and resource isolation. Orchestrated VM provisioning, template-based deployments, backup scheduling, and resource pooling across multiple physical hosts to maximize hardware utilization and uptime.",
    challenges: [
      "Optimizing resource allocation across competing virtual workloads",
      "Implementing reliable backup and disaster recovery procedures",
      "Migrating legacy on-premise applications into a virtualized container",
    ],
    outcomes: [
      "Consolidated 8 physical servers into 2 high-performance hosts",
      "Reduced hardware maintenance costs by approximately 60%",
      "Achieved 99.9% service availability across hosted applications",
    ],
  },
  {
    title: "Infrastructure Monitoring System",
    description:
      "Deployed Prometheus and Grafana monitoring with Gmail alert integration for real-time visibility and alerting.",
    tags: ["Prometheus", "Grafana", "Monitoring", "Alerting"],
    fullDescription:
      "Deployed a full-stack monitoring and alerting solution using Prometheus for metrics collection and Grafana for visualization. Integrated Gmail-based alerting to ensure the operations team received real-time notifications for threshold breaches, system degradation, and service outages.",
    challenges: [
      "Aggregating metrics from heterogeneous systems and network devices",
      "Tuning alert thresholds to minimize false positives while maintaining responsiveness",
      "Designing intuitive dashboards tailored for both technical and non-technical stakeholders",
    ],
    outcomes: [
      "Reduced mean time to detection (MTTD) for infrastructure issues by 70%",
      "Automated alerting eliminated the need for manual health checks",
      "Enabled proactive capacity planning through historical metric trends",
    ],
  },
];

const EDUCATION = [
  { degree: "B-Tech in Computer Network Engineering", institution: "Siantou University Institute, Yaoundé", year: "2025" },
  { degree: "HND in Network & Security", institution: "Siantou University Institute, Yaoundé", year: "2024" },
  { degree: "GCE Advanced Level", institution: "GBHS Foumbot", year: "2021" },
  { degree: "GCE Ordinary Level", institution: "GBHS New Bell, Douala", year: "2019" },
];

const CERTIFICATIONS = [
  { name: "CompTIA Security+ SYO-501", issuer: "Alison", year: "2023" },
  { name: "Cisco Cybersecurity Essentials", issuer: "Cisco", year: "2023" },
  { name: "Introduction to Cybersecurity", issuer: "Cisco", year: "2023" },
  { name: "Diploma in Interconnecting Networking Devices P1 (ICND1 v3)", issuer: "Alison", year: "2023" },
  { name: "Diploma in Interconnecting Networking Devices P2 (ICND2 v3)", issuer: "Alison", year: "2023" },
];

const SOFT_SKILLS = [
  { name: "Strong Communication & Collaboration", icon: Users },
  { name: "Problem-Solving & Critical Thinking", icon: Zap },
  { name: "Adaptability in Fast-Paced Environments", icon: Activity },
  { name: "Bilingual: English & French", icon: Globe },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const ORBITRON = "'Orbitron', sans-serif";
const MONO = "'JetBrains Mono', monospace";

const scrollTo = (href: string) => {
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

// ─── ANIMATED SECTION ────────────────────────────────────────────────────────

const AnimatedSection = ({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ─── TILT CARD ───────────────────────────────────────────────────────────────

const TiltCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 18;
    const y = ((e.clientY - r.top) / r.height - 0.5) * -18;
    el.style.transform = `perspective(900px) rotateX(${y}deg) rotateY(${x}deg) scale(1.025)`;
  };

  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "perspective(900px) rotateX(0) rotateY(0) scale(1)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{ transition: "transform 0.18s ease", transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
};

// ─── SECTION TITLE ───────────────────────────────────────────────────────────

const SectionTitle = ({ label, title, subtitle }: { label: string; title: string; subtitle?: string }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <div ref={ref} className="text-center mb-16">
      <motion.span
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="inline-block text-xs tracking-widest uppercase text-cyan-400 mb-3 px-4 py-1.5 rounded-full border border-cyan-400/25 bg-cyan-400/5"
        style={{ fontFamily: MONO }}
      >
        {label}
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, delay: 0.08 }}
        className="text-3xl md:text-5xl font-bold text-white mb-4"
        style={{ fontFamily: ORBITRON }}
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="text-slate-400 max-w-2xl mx-auto text-base md:text-lg"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
};

// ─── PARTICLE CANVAS ─────────────────────────────────────────────────────────

const ParticleCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let w = (canvas.width = canvas.offsetWidth);
    let h = (canvas.height = canvas.offsetHeight);

    const n = Math.min(70, Math.floor((w * h) / 13000));
    const pts = Array.from({ length: n }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.32,
      vy: (Math.random() - 0.5) * 0.32,
      r: Math.random() * 1.4 + 0.4,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        p.x = (p.x + p.vx + w) % w;
        p.y = (p.y + p.vy + h) % h;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(34,211,238,0.6)";
        ctx.fill();
      }
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d = Math.hypot(dx, dy);
          if (d < 125) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(37,99,235,${(1 - d / 125) * 0.3})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };

    draw();

    const resize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: "none" }}
      aria-hidden="true"
    />
  );
};

// ─── PROFILE HERO IMAGE ───────────────────────────────────────────────────────

const FLOATING_BADGES = [
  { label: "Cisco", color: "#1BA0E2", top: "6%", right: "2%", delay: "0s" },
  { label: "FortiGate", color: "#EE3124", top: "22%", left: "0%", delay: "1.1s" },
  { label: "Proxmox", color: "#E57000", bottom: "22%", right: "0%", delay: "0.5s" },
  { label: "Grafana", color: "#F46800", bottom: "8%", left: "8%", delay: "1.7s" },
];

const ProfileHeroImage = ({ size = "lg" }: { size?: "sm" | "lg" }) => {
  const isSm = size === "sm";

  return (
    <div
      className={`relative flex items-center justify-center select-none ${
        isSm ? "w-36 h-36" : "w-72 h-72 md:w-[400px] md:h-[400px]"
      }`}
      aria-hidden="true"
    >
      {/* Outer atmospheric glow */}
      {!isSm && (
        <>
          <div className="absolute inset-0 rounded-full bg-blue-600/18 blur-3xl" />
          <div className="absolute inset-6 rounded-full bg-cyan-500/10 blur-2xl" />
        </>
      )}

      {/* Outer spinning dashed ring */}
      {!isSm && (
        <div
          className="absolute w-full h-full rounded-full border border-dashed border-cyan-400/14"
          style={{ animation: "spin 32s linear infinite" }}
        />
      )}

      {/* Pulsing ring */}
      {!isSm && (
        <div
          className="absolute w-[87%] h-[87%] rounded-full border border-blue-400/14 animate-ping"
          style={{ animationDuration: "4.5s" }}
        />
      )}

      {/* Static rings */}
      {!isSm && (
        <>
          <div className="absolute w-[91%] h-[91%] rounded-full border border-white/5" />
          <div className="absolute w-[95%] h-[95%] rounded-full border border-white/3" />
        </>
      )}

      {/* Gradient-bordered photo frame */}
      <div
        className={`relative rounded-full ${isSm ? "w-full h-full" : "w-[70%] h-[70%]"}`}
        style={{
          padding: isSm ? "2px" : "2.5px",
          background: "linear-gradient(135deg, #22D3EE 0%, #2563EB 45%, #8B5CF6 80%, #22D3EE 100%)",
          boxShadow: isSm
            ? "0 0 20px rgba(37,99,235,0.35)"
            : "0 0 50px rgba(37,99,235,0.35), 0 0 90px rgba(34,211,238,0.12)",
        }}
      >
        <div className="w-full h-full rounded-full overflow-hidden bg-[#0B1120] relative">
          <ImageWithFallback
            src={profilePhoto}
            alt="PEPOUERE NGOUH ABDEL SAMAD — IT Engineer & Network Security Specialist"
            className="w-full h-full object-cover object-top"
          />
          {/* Vignette to blend white photo background with dark frame */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 30%, transparent 38%, rgba(11,17,32,0.7) 62%, rgba(11,17,32,0.97) 82%)",
            }}
          />
        </div>
      </div>

      {/* Floating tech badges — desktop/lg only */}
      {!isSm &&
        FLOATING_BADGES.map((badge) => (
          <div
            key={badge.label}
            className="absolute px-3 py-1.5 rounded-lg text-xs border backdrop-blur-sm"
            style={{
              top: badge.top,
              right: (badge as { right?: string }).right,
              bottom: (badge as { bottom?: string }).bottom,
              left: (badge as { left?: string }).left,
              borderColor: `${badge.color}35`,
              backgroundColor: `${badge.color}0d`,
              color: badge.color,
              fontFamily: MONO,
              animation: `float 4.5s ease-in-out ${badge.delay} infinite`,
            }}
          >
            {badge.label}
          </div>
        ))}

      {/* Available status badge — desktop/lg only */}
      {!isSm && (
        <div
          className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-1.5 rounded-full border border-green-400/25 bg-[rgba(5,8,22,0.7)] backdrop-blur-sm whitespace-nowrap"
        >
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
          <span className="text-green-400 text-xs" style={{ fontFamily: MONO }}>
            Available for Opportunities
          </span>
        </div>
      )}
    </div>
  );
};

// ─── NETWORK GLOBE (decorative – used in About) ───────────────────────────────

const NetworkGlobe = () => {
  const nodes = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        lon: (i / 20) * 360 + Math.random() * 18,
        lat: Math.random() * 130 - 65,
      })),
    []
  );

  return (
    <div className="relative w-28 h-28 select-none" aria-hidden="true">
      <div className="absolute inset-0 rounded-full bg-blue-600/20 blur-xl" />
      <div className="absolute inset-0" style={{ animation: "globeSpin 25s linear infinite" }}>
        <svg viewBox="-55 -55 110 110" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="gFill2" cx="35%" cy="30%">
              <stop offset="0%" stopColor="#1d4ed8" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#050816" stopOpacity="0.7" />
            </radialGradient>
            <filter id="nGlow2" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="1.5" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <circle cx="0" cy="0" r="50" fill="url(#gFill2)" stroke="rgba(37,99,235,0.3)" strokeWidth="0.4" />
          {[-30, 0, 30].map((lat) => {
            const y = (lat / 90) * 50;
            const rx = Math.sqrt(Math.max(0, 2500 - y * y));
            return <ellipse key={lat} cx="0" cy={y} rx={rx} ry={rx * 0.28} fill="none" stroke="rgba(37,99,235,0.2)" strokeWidth="0.4" />;
          })}
          {[0, 60, 120].map((deg) => (
            <ellipse key={deg} cx="0" cy="0" rx={Math.max(0.1, Math.abs(Math.cos((deg * Math.PI) / 180)) * 50)} ry="50" fill="none" stroke="rgba(37,99,235,0.15)" strokeWidth="0.4" transform={`rotate(${deg})`} />
          ))}
          {nodes.slice(0, 12).map((nd, i) => {
            const lr = (nd.lon * Math.PI) / 180;
            const ar = (nd.lat * Math.PI) / 180;
            return <circle key={i} cx={44 * Math.cos(ar) * Math.cos(lr)} cy={44 * Math.sin(ar)} r="1.4" fill={i % 2 === 0 ? "#22D3EE" : "#60A5FA"} filter="url(#nGlow2)"><animate attributeName="opacity" values="0.3;1;0.3" dur={`${2 + (i % 3) * 0.5}s`} repeatCount="indefinite" /></circle>;
          })}
        </svg>
      </div>
    </div>
  );
};

// ─── SCROLL PROGRESS ─────────────────────────────────────────────────────────

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <motion.div
      style={{ scaleX, transformOrigin: "0%", position: "fixed", top: 0, left: 0, right: 0, height: "2px", zIndex: 100 }}
      aria-hidden="true"
    >
      <div className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-500" />
    </motion.div>
  );
};

// ─── LOADER ──────────────────────────────────────────────────────────────────

const Loader = ({ onDone }: { onDone: () => void }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 2800);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#050816]"
      aria-label="Loading portfolio"
    >
      <motion.div
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.55 }}
        className="relative mb-8"
      >
        {/* Loader profile photo ring */}
        <div className="w-20 h-20 rounded-full overflow-hidden relative" style={{ padding: "2px", background: "linear-gradient(135deg,#22D3EE,#2563EB,#8B5CF6)" }}>
          <div className="w-full h-full rounded-full overflow-hidden bg-[#050816]">
            <ImageWithFallback
              src={profilePhoto}
              alt="Loading"
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 rounded-full" style={{ background: "radial-gradient(ellipse at 50% 30%, transparent 40%, rgba(5,8,22,0.9) 75%)" }} />
          </div>
        </div>
        <div className="absolute inset-0 rounded-full border-t-2 border-blue-500" style={{ animation: "spin 1s linear infinite" }} />
        <div className="absolute inset-1 rounded-full border-b border-cyan-400/40" style={{ animation: "spin 1.8s linear infinite reverse" }} />
        <div className="absolute inset-0 rounded-full bg-blue-500/10 blur-xl" />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="text-cyan-400 text-xs tracking-[0.35em] uppercase mb-7"
        style={{ fontFamily: MONO }}
      >
        Initializing Portfolio
      </motion.p>

      <div className="w-52 h-px bg-white/[0.05] rounded-full overflow-hidden">
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "0%" }}
          transition={{ duration: 2.2, delay: 0.5, ease: "linear" }}
          className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-400"
        />
      </div>
    </motion.div>
  );
};

// ─── NAVBAR ──────────────────────────────────────────────────────────────────

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.15 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div
        className={`mx-4 mt-3 px-6 py-3.5 flex items-center justify-between rounded-2xl transition-all duration-500 ${
          scrolled
            ? "bg-[rgba(5,8,22,0.88)] backdrop-blur-2xl border border-white/8 shadow-2xl shadow-black/60"
            : "bg-transparent"
        }`}
      >
        <button
          onClick={() => scrollTo("#home")}
          className="text-white font-extrabold text-base tracking-widest"
          style={{ fontFamily: ORBITRON }}
          aria-label="Go to top"
        >
          <span className="text-cyan-400">ABDEL</span>
          <span className="text-blue-400">SAMAD</span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-7" aria-label="Primary navigation">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              onClick={() => scrollTo(item.href)}
              className="text-sm text-slate-400 hover:text-cyan-400 transition-colors font-medium tracking-wide"
            >
              {item.label}
            </button>
          ))}
          <a
            href="/cv/PEPOUERE_NGOUH_ABDEL_SAMAD_CV.pdf"
            download
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/30"
          >
            <Download className="w-3.5 h-3.5" />
            CV
          </a>
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="lg:hidden text-slate-300 hover:text-white transition-colors p-1"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="mx-4 mt-2 rounded-2xl bg-[rgba(8,13,30,0.97)] backdrop-blur-2xl border border-white/8 p-6 lg:hidden"
          >
            <nav className="flex flex-col gap-4" aria-label="Mobile navigation">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.label}
                  onClick={() => { scrollTo(item.href); setMenuOpen(false); }}
                  className="text-left text-slate-300 hover:text-cyan-400 transition-colors font-medium py-0.5"
                >
                  {item.label}
                </button>
              ))}
              <a
                href="/cv/PEPOUERE_NGOUH_ABDEL_SAMAD_CV.pdf"
                download
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold w-fit mt-2"
              >
                <Download className="w-4 h-4" />
                Download CV
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

// ─── HERO ────────────────────────────────────────────────────────────────────

const Hero = () => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    setMouse({
      x: (e.clientX / window.innerWidth - 0.5) * 28,
      y: (e.clientY / window.innerHeight - 0.5) * 28,
    });
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
      onMouseMove={onMouseMove}
      aria-label="Hero"
    >
      <ParticleCanvas />

      {/* Background atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/15 via-transparent to-purple-900/15 pointer-events-none" />
      <div className="absolute top-1/3 left-1/5 w-[500px] h-[500px] bg-blue-700/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-700/5 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(37,99,235,1) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,1) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-28 pb-20">
        <div className="grid lg:grid-cols-[1fr_auto] gap-12 xl:gap-20 items-center">

          {/* ── Left: copy ── */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-cyan-400/22 bg-cyan-400/5 text-cyan-400 text-sm mb-7"
              style={{ fontFamily: MONO }}
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse flex-shrink-0" />
              Available for IT, Network &amp; Cybersecurity Opportunities
            </motion.div>

            {/* Mobile-only photo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.08 }}
              className="lg:hidden flex justify-center mb-8"
            >
              <ProfileHeroImage size="sm" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl xl:text-[4.2rem] font-bold text-white mb-2 leading-[1.08] tracking-tight"
              style={{ fontFamily: ORBITRON }}
            >
              PEPOUERE NGOUH
            </motion.h1>

            <motion.h1
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.16 }}
              className="text-4xl sm:text-5xl md:text-6xl xl:text-[4.2rem] font-bold mb-7 leading-[1.08] tracking-tight"
              style={{
                fontFamily: ORBITRON,
                background: "linear-gradient(130deg, #60A5FA 0%, #22D3EE 50%, #818CF8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              ABDEL SAMAD
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.24 }}
              className="text-slate-400 text-lg font-medium mb-4 tracking-wider"
              style={{ fontFamily: MONO }}
            >
              IT Engineer | Networking &amp; Security Specialist
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.32 }}
              className="text-slate-400 text-base md:text-lg mb-10 leading-relaxed max-w-2xl"
            >
              I design, deploy, secure, and monitor enterprise-grade IT infrastructures using{" "}
              <span className="text-cyan-400 font-medium">Cisco</span>,{" "}
              <span className="text-blue-400 font-medium">FortiGate</span>,{" "}
              <span className="text-purple-400 font-medium">Palo Alto</span>,{" "}
              <span className="text-cyan-300 font-medium">Proxmox</span>,{" "}
              <span className="text-green-400 font-medium">Prometheus</span>, and{" "}
              <span className="text-orange-400 font-medium">Grafana</span>.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4 mb-10"
            >
              <a
                href="/cv/PEPOUERE_NGOUH_ABDEL_SAMAD_CV.pdf"
                download
                className="group flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all duration-200 hover:shadow-2xl hover:shadow-blue-500/30"
              >
                <Download className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
                Download CV
              </a>
              <button
                onClick={() => scrollTo("#contact")}
                className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl border border-white/14 text-white font-semibold hover:border-cyan-400/40 hover:text-cyan-400 hover:bg-cyan-400/5 transition-all duration-200"
              >
                Contact Me
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex items-center gap-3"
            >
              {[
                { icon: Linkedin, href: "https://www.linkedin.com/in/abdel-samad-5b1335406/", label: "LinkedIn", c: "#0A66C2" },
                { icon: Mail, href: "mailto:abdel.samad@etsntech.org", label: "Email", c: "#22D3EE" },
                { icon: Github, href: "https://github.com/Ze-one", label: "GitHub", c: "#e2e8f0" },
                { icon: Phone, href: "tel:+237640116221", label: "Phone", c: "#34D399" },
              ].map(({ icon: Icon, href, label, c }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={label}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 transition-all duration-200 hover:scale-110"
                  style={{ border: "1px solid rgba(255,255,255,0.10)" }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = `${c}50`;
                    el.style.color = c;
                    el.style.backgroundColor = `${c}12`;
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = "rgba(255,255,255,0.10)";
                    el.style.color = "#94A3B8";
                    el.style.backgroundColor = "transparent";
                  }}
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </motion.div>
          </div>

          {/* ── Right: Profile photo (desktop) ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.65 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.95, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:flex items-center justify-center"
            style={{
              transform: `perspective(1400px) rotateX(${mouse.y * 0.07}deg) rotateY(${mouse.x * 0.07}deg)`,
              transition: "transform 0.2s ease",
            }}
          >
            <ProfileHeroImage size="lg" />
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
          onClick={() => scrollTo("#about")}
          className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-slate-600 hover:text-cyan-400 transition-colors"
          aria-label="Scroll to About section"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase" style={{ fontFamily: MONO }}>
            SCROLL
          </span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </motion.button>
      </div>
    </section>
  );
};

// ─── ABOUT ───────────────────────────────────────────────────────────────────

const About = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-28 px-6" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <SectionTitle label="About Me" title="Professional Summary" />

        <div className="grid lg:grid-cols-[auto_1.3fr_1fr] gap-10 xl:gap-14 items-start">
          {/* Photo column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="hidden lg:flex flex-col items-center gap-4"
          >
            {/* Smaller portrait frame */}
            <div
              className="relative w-52 h-52 rounded-2xl overflow-hidden"
              style={{
                padding: "2px",
                background: "linear-gradient(135deg, #22D3EE, #2563EB, #8B5CF6)",
                boxShadow: "0 0 40px rgba(37,99,235,0.25)",
              }}
            >
              <div className="w-full h-full rounded-[14px] overflow-hidden bg-[#0B1120] relative">
                <ImageWithFallback
                  src={profilePhoto}
                  alt="PEPOUERE NGOUH ABDEL SAMAD"
                  className="w-full h-full object-cover object-top"
                />
                <div
                  className="absolute inset-0 rounded-[14px]"
                  style={{
                    background: "linear-gradient(to bottom, transparent 55%, rgba(11,17,32,0.92) 100%)",
                  }}
                />
              </div>
            </div>
            {/* Mini globe accent */}
            <div className="flex items-center gap-2 opacity-70">
              <NetworkGlobe />
            </div>
          </motion.div>

          {/* Text column */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.75, delay: 0.1 }}
          >
            <p className="text-slate-200 text-lg leading-relaxed mb-5">
              Results-driven IT Engineer with hands-on experience in networking, virtualization, and cybersecurity solutions.
            </p>
            <p className="text-slate-400 leading-relaxed mb-5">
              Skilled in designing and deploying enterprise-grade infrastructures using Cisco routers and switches, FortiGate firewalls, Palo Alto appliances, and Proxmox virtualization platforms.
            </p>
            <p className="text-slate-400 leading-relaxed mb-8">
              Adept at implementing secure teleworking solutions, monitoring systems, and scalable IT environments that support business continuity and long-term growth.
            </p>
            <div className="flex flex-wrap gap-2">
              {["Networking", "Cybersecurity", "Virtualization", "Monitoring", "Infrastructure", "IT Consulting"].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs border border-cyan-400/22 text-cyan-400 bg-cyan-400/5"
                  style={{ fontFamily: MONO }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Quick facts card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.75, delay: 0.2 }}
            className="rounded-2xl border p-7 bg-white/[0.03] backdrop-blur-sm"
            style={{ borderColor: "rgba(255,255,255,0.10)" }}
          >
            <h3 className="font-semibold text-white mb-5 text-sm tracking-wider" style={{ fontFamily: ORBITRON }}>
              Quick Facts
            </h3>
            <div className="space-y-3">
              {[
                { icon: MapPin, label: "Location", value: "Yaoundé, Cameroon" },
                { icon: Globe, label: "Languages", value: "English & French (Bilingual)" },
                { icon: Shield, label: "Core Focus", value: "Networking · Security · Virtualization" },
                { icon: Star, label: "Career Direction", value: "Dynamic IT teams in Canada" },
                { icon: Lock, label: "Current Role", value: "IT Engineer @ ETS NTECH" },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="flex items-center gap-4 p-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-blue-600/14 border border-blue-500/22 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest" style={{ fontFamily: MONO }}>
                      {label}
                    </p>
                    <p className="text-slate-200 text-sm font-medium">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ─── SKILLS ──────────────────────────────────────────────────────────────────

const Skills = () => (
  <section id="skills" className="py-28 px-6">
    <div className="max-w-7xl mx-auto">
      <SectionTitle
        label="Expertise"
        title="Core Skills"
        subtitle="Technical capabilities developed through hands-on enterprise infrastructure deployments."
      />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {SKILL_CATEGORIES.map((cat, i) => {
          const Icon = cat.icon;
          return (
            <AnimatedSection key={cat.title} delay={i * 0.08}>
              <TiltCard className="h-full">
                <div
                  className="h-full rounded-2xl p-6 border bg-white/[0.04] backdrop-blur-sm hover:bg-white/[0.07] transition-colors group cursor-default overflow-hidden relative"
                  style={{ borderColor: "rgba(255,255,255,0.09)" }}
                >
                  <div
                    className="absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ backgroundColor: `${cat.color}22` }}
                  />
                  <div className="flex items-center gap-3 mb-5 relative">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${cat.color}14`, border: `1px solid ${cat.color}28` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: cat.color }} />
                    </div>
                    <h3 className="font-semibold text-white text-sm leading-snug" style={{ fontFamily: ORBITRON }}>
                      {cat.title}
                    </h3>
                  </div>
                  <ul className="space-y-2.5 relative">
                    {cat.skills.map((skill) => (
                      <li key={skill} className="flex items-center gap-2.5 text-slate-400 text-sm group-hover:text-slate-300 transition-colors">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              </TiltCard>
            </AnimatedSection>
          );
        })}
      </div>
    </div>
  </section>
);

// ─── TECH STACK ──────────────────────────────────────────────────────────────

const TechStack = () => (
  <section className="py-16 px-6">
    <div className="max-w-7xl mx-auto">
      <SectionTitle
        label="Technology"
        title="Technical Stack"
        subtitle="Tools and platforms I deploy in enterprise environments daily."
      />
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
        {TECH_STACK.map((tech, i) => (
          <AnimatedSection key={tech.name} delay={i * 0.04}>
            <TiltCard>
              <div
                className="flex flex-col items-center justify-center p-4 rounded-2xl border bg-white/[0.04] hover:bg-white/[0.08] transition-all group cursor-default"
                style={{ borderColor: "rgba(255,255,255,0.08)" }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = `${tech.color}45`;
                  el.style.boxShadow = `0 0 22px ${tech.color}14`;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "rgba(255,255,255,0.08)";
                  el.style.boxShadow = "none";
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold mb-2.5"
                  style={{ backgroundColor: `${tech.color}18`, color: tech.color, fontFamily: MONO }}
                >
                  {tech.abbr}
                </div>
                <span className="text-[10px] text-slate-500 group-hover:text-slate-300 text-center transition-colors leading-tight" style={{ fontFamily: MONO }}>
                  {tech.name}
                </span>
              </div>
            </TiltCard>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);

// ─── EXPERIENCE TIMELINE ─────────────────────────────────────────────────────

const ExperienceTimeline = () => (
  <section id="experience" className="py-28 px-6">
    <div className="max-w-4xl mx-auto">
      <SectionTitle
        label="Career"
        title="Experience"
        subtitle="A track record of delivering enterprise-grade IT solutions in real-world environments."
      />
      <div className="relative">
        <div className="absolute left-6 top-2 bottom-2 w-px bg-gradient-to-b from-blue-500 via-cyan-400/40 to-transparent hidden sm:block" />
        <div className="space-y-10">
          {EXPERIENCES.map((exp, i) => (
            <AnimatedSection key={i} delay={i * 0.12}>
              <div className="flex gap-10">
                <div className="hidden sm:block pt-2 flex-shrink-0">
                  <div
                    className="w-3 h-3 rounded-full border-2 border-blue-400 bg-[#050816]"
                    style={{ boxShadow: "0 0 12px rgba(37,99,235,0.55)" }}
                  />
                </div>
                <div
                  className="flex-1 rounded-2xl border p-6 bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
                  style={{ borderColor: "rgba(255,255,255,0.09)" }}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                    <div>
                      <h3 className="font-bold text-white text-xl mb-0.5" style={{ fontFamily: ORBITRON }}>
                        {exp.title}
                      </h3>
                      <p className="text-blue-400 font-medium text-sm">{exp.company}</p>
                    </div>
                    <span
                      className="px-3 py-1 rounded-full text-xs text-cyan-400 border border-cyan-400/22 bg-cyan-400/5 flex-shrink-0"
                      style={{ fontFamily: MONO }}
                    >
                      {exp.period}
                    </span>
                  </div>
                  <ul className="space-y-2.5">
                    {exp.highlights.map((h, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-slate-400 text-sm leading-relaxed">
                        <ArrowRight className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-400/60" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// ─── PROJECT MODAL ────────────────────────────────────────────────────────────

const ProjectModal = ({ project, onClose }: { project: Project; onClose: () => void }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border bg-[#0B1120] p-6 sm:p-8"
        style={{ borderColor: "rgba(255,255,255,0.10)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-2.5 h-2.5 rounded-full bg-cyan-400 flex-shrink-0"
            style={{ boxShadow: "0 0 8px rgba(34,211,238,0.65)" }}
          />
          <h3 className="font-bold text-white text-xl sm:text-2xl leading-snug" style={{ fontFamily: ORBITRON }}>
            {project.title}
          </h3>
        </div>

        <p className="text-slate-300 leading-relaxed mb-6">{project.fullDescription}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-xs rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/18"
              style={{ fontFamily: MONO }}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <h4 className="text-xs uppercase tracking-widest text-slate-500 mb-3" style={{ fontFamily: MONO }}>
              Challenges
            </h4>
            <ul className="space-y-2.5">
              {project.challenges.map((challenge, i) => (
                <li key={i} className="flex items-start gap-2.5 text-slate-400 text-sm leading-relaxed">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2 bg-red-400/70" />
                  {challenge}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-slate-500 mb-3" style={{ fontFamily: MONO }}>
              Outcomes
            </h4>
            <ul className="space-y-2.5">
              {project.outcomes.map((outcome, i) => (
                <li key={i} className="flex items-start gap-2.5 text-slate-400 text-sm leading-relaxed">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2 bg-green-400/70" />
                  {outcome}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── PROJECTS ────────────────────────────────────────────────────────────────

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section id="projects" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionTitle
          label="Portfolio"
          title="Selected Technical Work"
          subtitle="Hands-on infrastructure projects demonstrating real-world engineering expertise."
        />
        <div className="grid md:grid-cols-2 gap-6">
          {PROJECTS.map((project, i) => (
            <AnimatedSection key={project.title} delay={i * 0.09}>
              <TiltCard className="h-full">
                <div
                  className="h-full rounded-2xl border p-7 bg-white/[0.04] relative overflow-hidden group cursor-default transition-all duration-300"
                  style={{ borderColor: "rgba(255,255,255,0.09)" }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = "rgba(37,99,235,0.32)";
                    el.style.boxShadow = "0 0 40px rgba(37,99,235,0.10)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = "rgba(255,255,255,0.09)";
                    el.style.boxShadow = "none";
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0"
                        style={{ boxShadow: "0 0 7px rgba(34,211,238,0.65)" }}
                      />
                      <h3 className="font-bold text-white text-lg group-hover:text-cyan-400 transition-colors leading-snug" style={{ fontFamily: ORBITRON }}>
                        {project.title}
                      </h3>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed mb-5">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-5">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-0.5 text-xs rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/18"
                          style={{ fontFamily: MONO }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="flex items-center gap-2 text-xs text-slate-500 hover:text-cyan-400 transition-colors group/btn"
                      style={{ fontFamily: MONO }}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </TiltCard>
            </AnimatedSection>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>
    </section>
  );
};

// ─── EDUCATION ───────────────────────────────────────────────────────────────

const Education = () => (
  <section id="education" className="py-28 px-6">
    <div className="max-w-5xl mx-auto">
      <SectionTitle label="Academic" title="Education" />
      <div className="grid sm:grid-cols-2 gap-5">
        {EDUCATION.map((edu, i) => (
          <AnimatedSection key={i} delay={i * 0.1}>
            <div
              className="rounded-2xl border p-6 bg-white/[0.03] hover:bg-white/[0.06] transition-all group"
              style={{ borderColor: "rgba(255,255,255,0.09)" }}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-600/14 border border-blue-500/22 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3
                    className="font-semibold text-white mb-1.5 leading-snug text-sm group-hover:text-cyan-400 transition-colors"
                    style={{ fontFamily: ORBITRON }}
                  >
                    {edu.degree}
                  </h3>
                  <p className="text-slate-400 text-sm mb-2">{edu.institution}</p>
                  <span className="text-xs text-cyan-400" style={{ fontFamily: MONO }}>
                    {edu.year}
                  </span>
                </div>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);

// ─── CERTIFICATIONS ──────────────────────────────────────────────────────────

const Certifications = () => (
  <section id="certifications" className="py-28 px-6">
    <div className="max-w-6xl mx-auto">
      <SectionTitle
        label="Credentials"
        title="Certifications"
        subtitle="Industry-recognized credentials validating expertise in cybersecurity and networking."
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {CERTIFICATIONS.map((cert, i) => (
          <AnimatedSection key={i} delay={i * 0.09}>
            <div
              className="rounded-2xl border p-5 bg-white/[0.03] hover:bg-white/[0.06] hover:border-purple-400/22 transition-all group"
              style={{ borderColor: "rgba(255,255,255,0.09)" }}
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-purple-600/14 border border-purple-500/22 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Award className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-medium text-white text-sm leading-snug mb-1.5 group-hover:text-purple-300 transition-colors">
                    {cert.name}
                  </h3>
                  <p className="text-slate-500 text-xs mb-1.5">{cert.issuer}</p>
                  <span className="text-xs text-purple-400" style={{ fontFamily: MONO }}>
                    {cert.year}
                  </span>
                </div>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);

// ─── SOFT SKILLS ─────────────────────────────────────────────────────────────

const SoftSkills = () => (
  <section className="py-16 px-6">
    <div className="max-w-4xl mx-auto">
      <SectionTitle label="Personal" title="Soft Skills" />
      <div className="grid sm:grid-cols-2 gap-4">
        {SOFT_SKILLS.map((skill, i) => {
          const Icon = skill.icon;
          return (
            <AnimatedSection key={skill.name} delay={i * 0.1}>
              <div
                className="flex items-center gap-4 p-5 rounded-2xl border bg-white/[0.03] hover:bg-white/[0.07] transition-colors group"
                style={{ borderColor: "rgba(255,255,255,0.09)" }}
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-400/9 border border-cyan-400/18 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-cyan-400" />
                </div>
                <span className="text-slate-300 font-medium group-hover:text-white transition-colors text-sm">
                  {skill.name}
                </span>
              </div>
            </AnimatedSection>
          );
        })}
      </div>
    </div>
  </section>
);

// ─── DOWNLOAD CV CTA ─────────────────────────────────────────────────────────

const DownloadCVSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 px-6" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 44 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75 }}
          className="relative rounded-3xl border p-10 md:p-14 text-center overflow-hidden"
          style={{ borderColor: "rgba(37,99,235,0.22)", backgroundColor: "rgba(37,99,235,0.03)" }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/8 via-transparent to-purple-600/8 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-600/8 rounded-full blur-3xl pointer-events-none" />

          {/* Photo accent inside CTA */}
          <div className="relative z-10">
            <div
              className="w-20 h-20 rounded-full mx-auto mb-6 overflow-hidden"
              style={{
                padding: "2px",
                background: "linear-gradient(135deg, #22D3EE, #2563EB, #8B5CF6)",
                boxShadow: "0 0 30px rgba(37,99,235,0.3)",
              }}
            >
              <div className="w-full h-full rounded-full overflow-hidden bg-[#0B1120] relative">
                <ImageWithFallback
                  src={profilePhoto}
                  alt="PEPOUERE NGOUH ABDEL SAMAD"
                  className="w-full h-full object-cover object-top"
                />
                <div
                  className="absolute inset-0 rounded-full"
                  style={{ background: "radial-gradient(ellipse at 50% 30%, transparent 40%, rgba(11,17,32,0.9) 78%)" }}
                />
              </div>
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: ORBITRON }}>
              Want the full professional profile?
            </h2>
            <p className="text-slate-400 text-base md:text-lg mb-9 max-w-xl mx-auto">
              Download my CV to view my complete experience, education, certifications, and technical background.
            </p>
            <a
              href="/cv/PEPOUERE_NGOUH_ABDEL_SAMAD_CV.pdf"
              download
              className="inline-flex items-center gap-3 px-9 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base transition-all duration-200 hover:shadow-2xl hover:shadow-blue-500/35 group"
            >
              <Download className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
              Download PDF CV
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ─── CONTACT ─────────────────────────────────────────────────────────────────

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 1800));
    setSending(false);
    setSent(true);
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  const iClass =
    "w-full px-4 py-3 rounded-xl bg-white/[0.04] border text-white placeholder-slate-600 focus:outline-none focus:border-blue-400/38 focus:ring-1 focus:ring-blue-400/18 transition-all text-sm";
  const bStyle = { borderColor: "rgba(255,255,255,0.10)" };

  return (
    <section id="contact" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionTitle
          label="Get In Touch"
          title="Contact Me"
          subtitle="Ready to discuss IT infrastructure opportunities? I respond promptly."
        />
        <div className="grid lg:grid-cols-2 gap-14">
          {/* Info */}
          <AnimatedSection>
            <p className="text-slate-400 leading-relaxed mb-8">
              Whether you're looking for an IT Engineer to join your team in Canada or want to discuss a technical project, feel free to reach out.
            </p>
            <div className="space-y-4">
              {[
                { icon: Mail, label: "Email", value: "abdel.samad@etsntechl.org", href: "mailto:abdel.samad@etsntech.org" },
                { icon: Phone, label: "Phone", value: "(+237) 640 116 221", href: "tel:+237640116221" },
                { icon: MapPin, label: "Location", value: "Yaoundé, Cameroon", href: undefined },
                { icon: Linkedin, label: "LinkedIn", value: "linkedin.com/in/abdel-samad-075", href: "https://www.linkedin.com/in/abdel-samad-5b1335406/" },
              ].map(({ icon: Icon, label, value, href }) => (
                <div
                  key={label}
                  className="flex items-center gap-4 p-4 rounded-xl border bg-white/[0.03] hover:bg-white/[0.07] transition-colors"
                  style={bStyle}
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-600/14 border border-blue-500/22 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest" style={{ fontFamily: MONO }}>
                      {label}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        target={href.startsWith("http") ? "_blank" : undefined}
                        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="text-slate-200 font-medium text-sm hover:text-cyan-400 transition-colors break-all"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-slate-200 font-medium text-sm">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>

          {/* Form */}
          <AnimatedSection delay={0.2}>
            <form onSubmit={handleSubmit} className="rounded-2xl border p-7 bg-white/[0.03]" style={bStyle}>
              {sent ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle className="w-12 h-12 text-green-400 mb-4" />
                  <p className="text-white font-semibold text-lg mb-1.5">Message sent!</p>
                  <p className="text-slate-400 text-sm">I'll get back to you soon.</p>
                  <button
                    type="button"
                    onClick={() => setSent(false)}
                    className="mt-5 text-blue-400 text-sm hover:text-blue-300 transition-colors"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-name" className="block text-xs text-slate-400 mb-1.5" style={{ fontFamily: MONO }}>
                        Name
                      </label>
                      <input id="contact-name" type="text" required placeholder="Your name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className={iClass} style={bStyle} />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="block text-xs text-slate-400 mb-1.5" style={{ fontFamily: MONO }}>
                        Email
                      </label>
                      <input id="contact-email" type="email" required placeholder="your@email.com" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} className={iClass} style={bStyle} />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="contact-subject" className="block text-xs text-slate-400 mb-1.5" style={{ fontFamily: MONO }}>
                      Subject
                    </label>
                    <input id="contact-subject" type="text" required placeholder="Subject" value={form.subject} onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))} className={iClass} style={bStyle} />
                  </div>
                  <div>
                    <label htmlFor="contact-message" className="block text-xs text-slate-400 mb-1.5" style={{ fontFamily: MONO }}>
                      Message
                    </label>
                    <textarea id="contact-message" required rows={5} placeholder="Your message..." value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))} className={`${iClass} resize-none`} style={bStyle} />
                  </div>
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold transition-all hover:shadow-xl hover:shadow-blue-500/24 flex items-center justify-center gap-2"
                  >
                    {sending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/28 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <MessageSquare className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

// ─── FOOTER ──────────────────────────────────────────────────────────────────

const Footer = () => (
  <footer className="py-10 px-6 border-t" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-4">
        {/* Mini photo in footer */}
        <div
          className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0"
          style={{ padding: "1.5px", background: "linear-gradient(135deg,#22D3EE,#2563EB,#8B5CF6)" }}
        >
          <div className="w-full h-full rounded-full overflow-hidden bg-[#0B1120] relative">
            <ImageWithFallback src={profilePhoto} alt="PEPOUERE NGOUH ABDEL SAMAD" className="w-full h-full object-cover object-top" />
            <div className="absolute inset-0 rounded-full" style={{ background: "radial-gradient(ellipse at 50% 25%, transparent 40%, rgba(11,17,32,0.85) 80%)" }} />
          </div>
        </div>
        <div className="text-center md:text-left">
          <p className="font-extrabold text-white text-sm tracking-widest" style={{ fontFamily: ORBITRON }}>
            <span className="text-cyan-400">ABDEL</span>
            <span className="text-blue-400">SAMAD</span>
          </p>
          <p className="text-slate-500 text-xs mt-0.5">IT Engineer | Networking &amp; Security Specialist</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {[
          { icon: Linkedin, href: "https://www.linkedin.com/in/abdel-samad-5b1335406/", label: "LinkedIn" },
          { icon: Mail, href: "mailto:abdel.samad@etsntech.org", label: "Email" },
          { icon: Github, href: "https://github.com", label: "GitHub" },
          { icon: Phone, href: "tel:+237640116221", label: "Phone" },
        ].map(({ icon: Icon, href, label }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
            aria-label={label}
            className="w-9 h-9 rounded-lg border flex items-center justify-center text-slate-500 hover:text-cyan-400 hover:border-cyan-400/38 transition-all"
            style={{ borderColor: "rgba(255,255,255,0.09)" }}
          >
            <Icon className="w-4 h-4" />
          </a>
        ))}
      </div>

      <p className="text-slate-600 text-xs text-center md:text-right">
        © 2026 PEPOUERE NGOUH ABDEL SAMAD.
        <br />
        All Rights Reserved.
      </p>
    </div>
  </footer>
);

// ─── APP ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [loading, setLoading] = useState(true);
  const done = useCallback(() => setLoading(false), []);

  return (
    <>
      <style>{`
        @keyframes globeSpin {
          from { transform: rotateY(0deg); }
          to   { transform: rotateY(360deg); }
        }
        @keyframes orbitRing {
          from { transform: rotateX(72deg) rotateZ(0deg); }
          to   { transform: rotateX(72deg) rotateZ(360deg); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-9px); }
        }
        html { scroll-behavior: smooth; }
        body { font-family: 'Inter', sans-serif; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #050816; }
        ::-webkit-scrollbar-thumb { background: rgba(37,99,235,0.38); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(34,211,238,0.45); }
      `}</style>

      <AnimatePresence>
        {loading && <Loader key="loader" onDone={done} />}
      </AnimatePresence>

      {!loading && (
        <div className="min-h-screen bg-[#050816] text-white overflow-x-hidden">
          <ScrollProgress />
          <Navbar />
          <main>
            <Hero />
            <About />
            <Skills />
            <TechStack />
            <ExperienceTimeline />
            <Projects />
            <Education />
            <Certifications />
            <SoftSkills />
            <DownloadCVSection />
            <Contact />
          </main>
          <Footer />
        </div>
      )}
    </>
  );
}
