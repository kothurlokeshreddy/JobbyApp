import {Component} from 'react'
import {Link} from 'react-router-dom'
import {BsSearch} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import Header from '../Header'
import FiltersGroup from '../FiltersGroup'
import JobCard from '../JobCard'

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import './index.css'

const apiStatusConstantsProfile = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const apiStatusConstantsJobs = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    profileDetails: [],
    apiStatusOfProfile: apiStatusConstantsProfile.initial,
    jobDetails: [],
    apiStatusOfJobs: apiStatusConstantsJobs.initial,
    searchInput: '',
    activeSalaryRangeId: '',
    employmentTypesChecked: [],
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobDetails()
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onSearchClick = () => {
    this.getJobDetails()
  }

  updateSalaryRangeId = activeSalaryRangeId => {
    this.setState({activeSalaryRangeId}, this.getJobDetails)
  }

  updateEmploymentTypesChecked = typeId => {
    const {employmentTypesChecked} = this.state
    let updatedList = employmentTypesChecked
    if (employmentTypesChecked.includes(typeId)) {
      updatedList = employmentTypesChecked.filter(
        eachType => eachType !== typeId,
      )
    } else {
      updatedList = [...updatedList, typeId]
    }

    this.setState({employmentTypesChecked: updatedList}, this.getJobDetails)
  }

  getProfileDetails = async () => {
    this.setState({apiStatusOfProfile: apiStatusConstantsProfile.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const profileData = await response.json()
      const formattedProfileData = {
        name: profileData.profile_details.name,
        profileImageUrl: profileData.profile_details.profile_image_url,
        shortBio: profileData.profile_details.short_bio,
      }
      this.setState({
        profileDetails: formattedProfileData,
        apiStatusOfProfile: apiStatusConstantsProfile.success,
      })
    } else {
      this.setState({apiStatusOfProfile: apiStatusConstantsProfile.failure})
    }
  }

  getJobDetails = async () => {
    this.setState({apiStatusOfJobs: apiStatusConstantsJobs.inProgress})
    const {
      activeSalaryRangeId,
      employmentTypesChecked,
      searchInput,
    } = this.state
    const employTypes = employmentTypesChecked.join(',')
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs?employment_type=${employTypes}&minimum_package=${activeSalaryRangeId}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const jobsData = await response.json()
      const formattedJobsData = jobsData.jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      this.setState({
        jobDetails: formattedJobsData,
        apiStatusOfJobs: apiStatusConstantsJobs.success,
      })
    } else {
      this.setState({apiStatusOfJobs: apiStatusConstantsJobs.failure})
    }
  }

  renderProfileDetailsSuccess = () => {
    const {profileDetails} = this.state
    const {name, profileImageUrl, shortBio} = profileDetails
    return (
      <div className="profile-container">
        <img src={profileImageUrl} alt="profile" className="profile-logo" />
        <h1 className="profile-name">{name}</h1>
        <p className="profile-description">{shortBio}</p>
      </div>
    )
  }

  onClickProfileRetry = () => {
    this.getProfileDetails()
  }

  renderProfileDetailsFailure = () => (
    <button className="button" type="button" onClick={this.onClickProfileRetry}>
      Retry
    </button>
  )

  renderProfileDetailsInProgress = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfileDetails = () => {
    const {apiStatusOfProfile} = this.state

    switch (apiStatusOfProfile) {
      case apiStatusConstantsProfile.success:
        return this.renderProfileDetailsSuccess()
      case apiStatusConstantsProfile.failure:
        return this.renderProfileDetailsFailure()
      case apiStatusConstantsProfile.inProgress:
        return this.renderProfileDetailsInProgress()
      default:
        return null
    }
  }

  renderJobDetailsSuccess = () => {
    const {jobDetails} = this.state
    if (jobDetails.length > 0) {
      return (
        <ul className="job-container">
          {jobDetails.map(eachJob => (
            <Link
              to={`/jobs/${eachJob.id}`}
              style={{textDecoration: 'none'}}
              key={eachJob.id}
            >
              <JobCard key={eachJob.id} jobDetails={eachJob} />
            </Link>
          ))}
        </ul>
      )
    }
    return (
      <div className="no-jobs-found-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
          className="no-jobs-img"
        />
        <h1>No Jobs Found</h1>
        <p>We could not find any jobs. Try other filters</p>
      </div>
    )
  }

  renderJobDetailsFailure = () => (
    <div className="job-error">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button className="button" type="button" onClick={this.getJobDetails}>
        Retry
      </button>
    </div>
  )

  renderJobDetailsInProgress = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobDetails = () => {
    const {apiStatusOfJobs} = this.state

    switch (apiStatusOfJobs) {
      case apiStatusConstantsJobs.success:
        return this.renderJobDetailsSuccess()
      case apiStatusConstantsJobs.failure:
        return this.renderJobDetailsFailure()
      case apiStatusConstantsJobs.inProgress:
        return this.renderJobDetailsInProgress()
      default:
        return null
    }
  }

  render() {
    const {searchInput} = this.state

    return (
      <div className="jobs-container">
        <Header />
        <div className="jobs-content">
          <div className="search-mobile-container">
            <input
              type="search"
              className="search-input"
              placeholder="Search"
              value={searchInput}
              onChange={this.onChangeSearchInput}
            />
            <button
              className="search-button"
              type="button"
              onClick={this.onSearchClick}
              data-testid="searchButton"
              aria-label="search"
            >
              <BsSearch className="search-icon" />
            </button>
          </div>
          <div className="filters-section">
            {this.renderProfileDetails()}
            <FiltersGroup
              updateEmploymentTypesChecked={this.updateEmploymentTypesChecked}
              updateSalaryRangeId={this.updateSalaryRangeId}
            />
          </div>
          <div className="jobs-section">
            <div className="search-container">
              <input
                type="search"
                className="search-input"
                placeholder="Search"
                value={searchInput}
                onChange={this.onChangeSearchInput}
              />
              <button
                className="search-button"
                type="button"
                onClick={this.onSearchClick}
                data-testid="searchButton"
                aria-label="search"
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.renderJobDetails()}
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
