import { ProjectCard } from "@/components/project/ProjectCard"

export const DevHome = () => {

  return (
    <div>
      <div className="flex flex-col min-h-screen">
        <div className="flex flex-col md:flex-row  justify-between mx-10 mt-10">
          <div className="w-full md:w-2/3">
            <h1>Projects</h1>
            <ProjectCard />
          </div>
          <div>
            <h3>Filters</h3>
          </div>
        </div>
        </div>
    </div>
  )
}
