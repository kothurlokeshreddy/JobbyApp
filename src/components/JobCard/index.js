import {BsStarFill, BsBriefcaseFill} from 'react-icons/bs'
import {IoLocationSharp} from 'react-icons/io5'

import './index.css'

const JobCard = props => {
  const {jobDetails} = props
  const {
    id,
    companyLogoUrl,
    title,
    rating,
    location,
    employmentType,
    packagePerAnnum,
    jobDescription,
  } = jobDetails

  return (
    <li className="job-item" key={id}>
      <div className="img-role-container">
        <img
          src={companyLogoUrl}
          alt="company logo url"
          className="company-img"
        />
        <div className="role-details">
          <h1 className="role-name">{title}</h1>
          <div className="role-rating">
            <BsStarFill className="star-icon" color="#fbbf24" />
            <p>{rating}</p>
          </div>
        </div>
      </div>
      <div className="location-package-container">
        <div className="location-type">
          <div className="location">
            <IoLocationSharp className="star-icon" />
            <p>{location}</p>
          </div>
          <div className="employment">
            <BsBriefcaseFill className="star-icon" />
            <p>{employmentType}</p>
          </div>
        </div>
        <div className="package-container">
          <p>{packagePerAnnum}</p>
        </div>
      </div>
      <hr />
      <div className="job-description">
        <h3>Description</h3>
        <p>{jobDescription}</p>
      </div>
    </li>
  )
}

export default JobCard
