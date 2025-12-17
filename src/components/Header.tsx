// "use client";

// import { Button } from "@/components/ui/button";
// import { Heart } from "lucide-react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";

// const Header = () => {
//   const pathname = usePathname();

//   const scrollToSection = (sectionId: string) => {
//     // If we're on the home page, scroll to section
//     if (pathname === "/") {
//       const element = document.getElementById(sectionId);
//       if (element) {
//         element.scrollIntoView({ behavior: "smooth" });
//       }
//     } else {
//       // If we're on another page, navigate to home page with hash
//       window.location.href = `/#${sectionId}`;
//     }
//   };

//   const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
//     e.preventDefault();
//     scrollToSection(sectionId);
//   };

//   return (
//     <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
//       <div className="container mx-auto px-6">
//         <nav className="flex items-center justify-between h-16 md:h-20">
//           {/* Logo */}
//           <Link href="/" className="flex items-center gap-2 group">
//             <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center shadow-gold transition-transform duration-300 group-hover:scale-105">
//               <Heart className="w-5 h-5 text-accent-foreground fill-current" />
//             </div>
//             <span className="font-serif text-xl font-semibold text-foreground tracking-tight">
//               BlessPay
//             </span>
//           </Link>

//           {/* Navigation Links - Hidden on mobile */}
//           <div className="hidden md:flex items-center gap-8">
//             <a 
//               href="#features" 
//               onClick={(e) => handleNavClick(e, "features")}
//               className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
//             >
//               Features
//             </a>
//             <a 
//               href="#community" 
//               onClick={(e) => handleNavClick(e, "community")}
//               className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
//             >
//               Community
//             </a>
//             <a 
//               href="#about" 
//               onClick={(e) => handleNavClick(e, "about")}
//               className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
//             >
//               About
//             </a>
//           </div>

//           {/* CTA Buttons */}
//           <div className="flex items-center gap-3">
//             <Link href="/login">
//               <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
//                 Sign In
//               </Button>
//             </Link>
//             <Link href="/signup">
//               <Button variant="gold" size="sm">
//                 Get Started
//               </Button>
//             </Link>
//           </div>
//         </nav>
//       </div>
//     </header>
//   );
// };

// export default Header;