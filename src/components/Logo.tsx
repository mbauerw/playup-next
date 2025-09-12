import Link from "next/link"

const Logo = () => {
  return (
    <div className="flex flex-row items-center gap-2 group hover:cursor-pointer ">
      <Link
        href="/"
        className="text-3xl bg-fuchsia-600 font-bold text-white py-1 px-3 rounded-full transition-colors shadow-lg"
      >
        P
      </Link>
      <h2
        className="text-white group-hover:text-gray-200 text-2xl transition-colors font-josefin"
      >
        PlayUp
      </h2>

    </div>

  )
}

export default Logo;

// font-poppins 