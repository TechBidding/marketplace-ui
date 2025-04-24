import React from 'react'
import { useParams } from 'react-router-dom';

export const ProjectDetails = () => {
    const { id } = useParams();
  return (
      <div>ProjectDetails: { id}</div>
  )
}
