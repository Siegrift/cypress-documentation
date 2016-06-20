import { action } from 'mobx'
import App from '../lib/app'
import projectsStore from '../projects/projects-store'

const getProjects = () => {
  App.ipc('get:project:paths').then(action('get:project:paths', (projects) => {
    projectsStore.setProjects(projects)
  }))
}

const launchBrowser = (project, browser, url) => {
  project.setChosenBrowserByName(browser)
  // project.browserOpening()

  App.ipc('launch:browser', { browser, url }, (err, data = {}) => {
    if (data.browserOpened) {
      // project.browserOpened()
    }

    if (data.browserClosed) {
      App.ipc.off('launch:browser')
      // project.browserClosed()
    }
  })
}

const closeProject = () => {
  return App.ipc("close:project")
}

const openProject = (project) => {
  // projectsStore.setChosen(project)

  return App.ipc('open:project', project.path)
  .then(action('open:project', (config) => {
    // this will set the available browsers on the project
    project.setBrowsers(config.browsers)
  }))
  .then(() => {
    // create a promise which listens for
    // project settings change events
    // and updates our project model
    const listenToProjectSettingsChange = () => {
      return App.ipc('on:project:settings:change')
      .then((data = {}) => {
        project.reset()
        project.setBrowsers(data.config.browsers)

        // if we had an open browser then launch it again!
        if (data.browser) {
          launchBrowser(project, data.browser)
        }

        // recursively listen for more
        // change events!
        return listenToProjectSettingsChange()
      })
    }
    return listenToProjectSettingsChange()
  })
  .catch((err) => {
    throw err
    // project.setError(err)
  })
}

export {
  getProjects,
  openProject,
  closeProject,
}
