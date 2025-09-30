import Link from "next/link"
import Image from "next/image"

const Logo = () => {
  return (
    <div className="flex flex-row items-center gap-2 group hover:cursor-pointer ">
      <Link
        href="/"
        className="font-bold text-white py-1 px-3 rounded-full transition-colors shadow-lg"
      >
        <Image
          src="/regroove-logo-transparent.png"
          alt="ReGroove Logo"
          width={120}
          height={40}
          className="object-contain" />
      </Link>
      

    </div>

  )
}

export default Logo;

// font-poppins 