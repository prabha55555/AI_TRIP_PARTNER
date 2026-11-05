function Logo({ className = "h-8 w-8" }) {
    return <img src="/logoo.png" alt="" aria-hidden="true" className={`${className} object-contain`} />;
}

export default Logo;
