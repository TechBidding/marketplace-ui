import React, { useEffect, useState } from 'react'
import { useTheme } from '../theme-provider'
import { useParams } from 'react-router-dom'
import {
  HiOutlineBriefcase,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineEye,
  HiOutlineFilter,
  HiOutlineSearch,
  HiOutlineCalendar,
  HiOutlineCurrencyDollar
} from 'react-icons/hi'

export const Projects = () => {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const params = useParams()

  const textClr = isDark ? "text-gray-100" : "text-gray-900"
  const subtleText = isDark ? "text-gray-400" : "text-gray-600"
  const cardBg = isDark ? "bg-gray-800/30" : "bg-white/60"
  const borderClr = isDark ? "border-gray-700/50" : "border-gray-200/50"

  const [activeFilter, setActiveFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Mock project data - replace with actual API call
  const projects = [
    {
      id: 1,
      title: "E-commerce Website Redesign",
      description: "Complete redesign and development of a modern e-commerce platform with React and Node.js",
      status: "completed",
      budget: 5000,
      startDate: "2024-01-15",
      endDate: "2024-03-20",
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
      client: "TechCorp Ltd",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop"
    },
    {
      id: 2,
      title: "Mobile App Development",
      description: "Native iOS and Android app for food delivery service with real-time tracking",
      status: "in-progress",
      budget: 8000,
      startDate: "2024-02-01",
      endDate: "2024-05-15",
      technologies: ["React Native", "Firebase", "Stripe", "Google Maps API"],
      client: "FoodieApp Inc",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop"
    },
    {
      id: 3,
      title: "Dashboard Analytics Platform",
      description: "Real-time analytics dashboard for business intelligence and data visualization",
      status: "completed",
      budget: 6500,
      startDate: "2023-11-10",
      endDate: "2024-01-30",
      technologies: ["Vue.js", "D3.js", "PostgreSQL", "Express"],
      client: "DataCorp Analytics",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop"
    },
    {
      id: 4,
      title: "SaaS Platform Development",
      description: "Multi-tenant SaaS platform for project management with advanced features",
      status: "pending",
      budget: 12000,
      startDate: "2024-04-01",
      endDate: "2024-08-15",
      technologies: ["Next.js", "Prisma", "PostgreSQL", "Stripe"],
      client: "ProjectFlow Solutions",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop"
    }
  ]

  const filters = [
    { id: 'all', label: 'All Projects', count: projects.length },
    { id: 'completed', label: 'Completed', count: projects.filter(p => p.status === 'completed').length },
    { id: 'in-progress', label: 'In Progress', count: projects.filter(p => p.status === 'in-progress').length },
    { id: 'pending', label: 'Pending', count: projects.filter(p => p.status === 'pending').length }
  ]

  const filteredProjects = projects.filter(project => {
    const matchesFilter = activeFilter === 'all' || project.status === activeFilter
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesFilter && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <HiOutlineCheckCircle className="w-4 h-4" />
      case 'in-progress':
        return <HiOutlineClock className="w-4 h-4" />
      case 'pending':
        return <HiOutlineCalendar className="w-4 h-4" />
      default:
        return <HiOutlineBriefcase className="w-4 h-4" />
    }
  }

  const ProjectCard = ({ project }: { project: any }) => (
    <div className={`${cardBg} rounded-2xl border ${borderClr} overflow-hidden hover:shadow-lg transition-all duration-300 group`}>
      {/* Project Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <div className="absolute top-4 right-4">
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
            {getStatusIcon(project.status)}
            {project.status.replace('-', ' ')}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
        </div>
      </div>

      {/* Project Content */}
      <div className="p-6">
        <p className={`${subtleText} mb-4 line-clamp-2`}>
          {project.description}
        </p>

        {/* Technologies */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {project.technologies.slice(0, 3).map((tech: string, index: number) => (
              <span
                key={index}
                className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-xs rounded-full"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                +{project.technologies.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Project Details */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <p className={`${subtleText} mb-1`}>Budget</p>
            <p className={`font-semibold ${textClr} flex items-center gap-1`}>
              <HiOutlineCurrencyDollar className="w-4 h-4" />
              ${project.budget.toLocaleString()}
            </p>
          </div>
          <div>
            <p className={`${subtleText} mb-1`}>Duration</p>
            <p className={`font-semibold ${textClr}`}>
              {Math.ceil((new Date(project.endDate).getTime() - new Date(project.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30))} months
            </p>
          </div>
        </div>

        {/* Client */}
        <div className="mb-4">
          <p className={`${subtleText} text-sm mb-1`}>Client</p>
          <p className={`font-medium ${textClr}`}>{project.client}</p>
        </div>

        {/* Action Button */}
        <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
          <HiOutlineEye className="w-5 h-5" />
          View Details
        </button>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h3 className={`text-lg font-bold ${textClr} mb-2`}>Project Portfolio</h3>
          <p className={`${subtleText}`}>
            {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
            {activeFilter !== 'all' && ` (${activeFilter.replace('-', ' ')})`}
          </p>
        </div>

        {/* Search */}
        <div className="flex gap-4">
          <div className="relative">
            <HiOutlineSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${subtleText}`} />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-10 pr-4 py-2 rounded-xl border transition-all duration-200 w-64 ${isDark
                  ? 'bg-gray-800/50 border-gray-700 focus:border-indigo-500 text-gray-100'
                  : 'bg-white border-gray-200 focus:border-indigo-500 text-gray-900'
                } focus:ring-2 focus:ring-indigo-500/20 focus:outline-none`}
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${activeFilter === filter.id
                ? 'bg-indigo-600 text-white shadow-lg'
                : isDark
                  ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            <span>{filter.label}</span>
            <span className={`px-2 py-1 rounded-full text-xs ${activeFilter === filter.id
                ? 'bg-white/20 text-white'
                : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
              }`}>
              {filter.count}
            </span>
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className={`${cardBg} rounded-2xl border ${borderClr} p-12 text-center`}>
          <HiOutlineBriefcase className={`w-16 h-16 ${subtleText} mx-auto mb-4`} />
          <h3 className={`text-lg font-semibold ${textClr} mb-2`}>
            {searchTerm ? 'No projects found' : 'No projects yet'}
          </h3>
          <p className={`${subtleText} mb-6`}>
            {searchTerm
              ? 'Try adjusting your search terms or filters'
              : 'Projects will appear here once they are created'
            }
          </p>
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('')
                setActiveFilter('all')
              }}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  )
}
