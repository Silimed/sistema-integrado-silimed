import Image from "next/image";
import Link from "next/link";

interface Application {
  id: string;
  name: string;
  description: string;
  url: string;
  icon: string;
  sectors: string[];
}

interface ApplicationCardProps {
  application: Application;
}

export function ApplicationCard({ application }: ApplicationCardProps) {
  return (
    <Link
      href={application.url}
      className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="relative w-12 h-12 mr-4">
            <Image
              src={application.icon}
              alt={`${application.name} icon`}
              fill
              className="object-contain rounded-lg"
            />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            {application.name}
          </h2>
        </div>

        <p className="text-gray-600 mb-4">{application.description}</p>

        <div className="flex flex-wrap gap-2">
          {application.sectors.map((sector) => (
            <span
              key={sector}
              className="px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
            >
              {sector}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
