import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsStarFill, BsBriefcaseFill} from 'react-icons/bs'
import {IoLocationSharp} from 'react-icons/io5'
import {GoLinkExternal} from 'react-icons/go'

import Header from '../Header'

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import './index.css'

const apiStatusConstantsJobItem = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobDetails: [],
    apiStatus: apiStatusConstantsJobItem.initial,
  }

  componentDidMount() {
    this.getJobItemDetails()
  }

  getJobItemDetails = async () => {
    this.setState({apiStatus: apiStatusConstantsJobItem.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const jobItemData = await response.json()
      const formattedData = {
        companyLogoUrl: jobItemData.job_details.company_logo_url,
        companyWebsiteUrl: jobItemData.job_details.company_website_url,
        employmentType: jobItemData.job_details.employment_type,
        id: jobItemData.job_details.id,
        jobDescription: jobItemData.job_details.job_description,
        location: jobItemData.job_details.location,
        packagePerAnnum: jobItemData.job_details.package_per_annum,
        rating: jobItemData.job_details.rating,
        title: jobItemData.job_details.title,
        skills: jobItemData.job_details.skills.map(eachSkill => ({
          imageUrl: eachSkill.image_url,
          name: eachSkill.name,
        })),
        lifeAtCompany: {
          description: jobItemData.job_details.life_at_company.description,
          imageUrl: jobItemData.job_details.life_at_company.image_url,
        },
        similarJobs: jobItemData.similar_jobs.map(eachJob => ({
          companyLogoUrl: eachJob.company_logo_url,
          employmentType: eachJob.employment_type,
          jobDescription: eachJob.job_description,
          location: eachJob.location,
          rating: eachJob.rating,
          title: eachJob.title,
          id: eachJob.id,
        })),
      }
      this.setState({
        jobDetails: formattedData,
        apiStatus: apiStatusConstantsJobItem.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstantsJobItem.failure})
    }
  }

  renderJobsSuccessView = () => {
    const {jobDetails} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      id,
      location,
      rating,
      skills,
      lifeAtCompany,
      packagePerAnnum,
      title,
    } = jobDetails
    return (
      <>
        <div className="job-item" key={id}>
          <div className="img-role-container">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
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
            <div className="description-visit">
              <h1>Description</h1>
              <a href={companyWebsiteUrl} target="_blank" rel="noreferrer">
                <div className="visit-container">
                  <p>Visit</p>
                  <GoLinkExternal
                    style={{alignSelf: 'center', marginLeft: '5px'}}
                  />
                </div>
              </a>
            </div>
            <p>{jobDescription}</p>
          </div>
          <div className="skills-container">
            <h1>Skills</h1>
            <ul className="skills-container">
              {skills.map(eachSkill => (
                <li key={eachSkill.name}>
                  <img src={eachSkill.imageUrl} alt={eachSkill.name} />
                  <p>{eachSkill.name}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="life-description">
            <h1>Life At Company</h1>
            <div className="description-img">
              <p>{lifeAtCompany.description}</p>
              <img src={lifeAtCompany.imageUrl} alt="life at company" />
            </div>
          </div>
        </div>
        {this.renderSimilarJobs()}
      </>
    )
  }

  renderSimilarJobs = () => {
    const {jobDetails} = this.state
    const {similarJobs} = jobDetails
    return (
      <>
        <h1>Similar Jobs</h1>
        <ul className="similar-jobs-container">
          {similarJobs.map(eachJob => (
            <li key={eachJob.id}>
              <div className="img-role-container">
                <img
                  src={eachJob.companyLogoUrl}
                  alt="similar job company logo"
                  className="company-img"
                />
                <div className="role-details">
                  <h1 className="role-name">{eachJob.title}</h1>
                  <div className="role-rating">
                    <BsStarFill className="star-icon" color="#fbbf24" />
                    <p>{eachJob.rating}</p>
                  </div>
                </div>
              </div>
              <h1>Description</h1>
              <p style={{color: '#cbd5e1'}}>{eachJob.jobDescription}</p>
              <div className="location-type">
                <div className="location">
                  <IoLocationSharp className="star-icon" />
                  <p>{eachJob.location}</p>
                </div>
                <div className="employment">
                  <BsBriefcaseFill className="star-icon" />
                  <p>{eachJob.employmentType}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </>
    )
  }

  renderJobsFailureView = () => (
    <div className="job-error">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something went wrong!</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button
        className="retry-btn"
        type="button"
        onClick={this.getJobItemDetails}
      >
        Retry
      </button>
    </div>
  )

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstantsJobItem.success:
        return this.renderJobsSuccessView()
      case apiStatusConstantsJobItem.failure:
        return this.renderJobsFailureView()
      case apiStatusConstantsJobItem.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-details-mobile-container">
          {this.renderJobDetails()}
        </div>
      </>
    )
  }
}

export default JobItemDetails
