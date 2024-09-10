import { useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useMutation, useQuery } from '@apollo/client'
import { useUser } from '../../../../lib/hooks'
import { ToastContext } from '../../../../lib/ToastContext'
import EditableSection from '../../../shared/EditableSection'
import Pill from '../../../shared/form/Pill'
import Select from '../../../shared/form/Select'
import { UPDATE_PRODUCT_PROJECTS } from '../../../shared/mutation/product'
import { PROJECT_SEARCH_QUERY } from '../../../shared/query/project'
import { DisplayType } from '../../../utils/constants'
import ProjectCard from '../project/ProjectCard'
import CreateButton from '../../../shared/form/CreateButton'
import Dialog, { DialogType } from '../../../shared/Dialog'
import ProjectForm from '../project/ProjectForm'
import { Error, Loading, NotFound } from '../../../shared/FetchStatus'

const ProductDetailProjects = ({ product, canEdit, headerRef }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [projects, setProjects] = useState(product.projects)
  const [isDirty, setIsDirty] = useState(false)

  const [isCreateProjectDialogOpen, setIsCreateProjectDialogOpen] = useState(false)

  const toggleCreateProjectDialog = () => setIsCreateProjectDialogOpen(!isCreateProjectDialogOpen)

  const { user } = useUser()
  const { locale } = useRouter()

  const { showSuccessMessage, showFailureMessage } = useContext(ToastContext)

  const [updateProductProjects, { loading, reset }] = useMutation(UPDATE_PRODUCT_PROJECTS, {
    onError() {
      setIsDirty(false)
      setProjects(product?.projects)
      showFailureMessage(format('toast.submit.failure', { entity: format('ui.project.header') }))
      reset()
    },
    onCompleted: (data) => {
      const { updateProductProjects: response } = data
      if (response?.product && response?.errors?.length === 0) {
        setIsDirty(false)
        setProjects(response?.product?.projects)
        showSuccessMessage(format('toast.submit.success', { entity: format('ui.project.header') }))
      } else {
        setIsDirty(false)
        setProjects(product?.projects)
        showFailureMessage(format('toast.submit.failure', { entity: format('ui.project.header') }))
        reset()
      }
    }
  })

  const [projectsInput, setProjectsInput] = useState('')

  const { loading: loadingProjects, error , data: projectData } = useQuery(PROJECT_SEARCH_QUERY, {
    variables: {
      search: projectsInput
    }
  })

  if (loadingProjects) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!projectData?.projects) {
    return <NotFound />
  }

  const fetchedProjectsCallback = (data) => (
    data.projects?.map((project) => ({
      id: project.id,
      name: project.name,
      slug: project.slug,
      label: project.name,
      countries: project.countries
    }))
  )

  const addProject = (project) => {
    setProjects([
      ...[
        ...projects.filter(({ id }) => id !== project.id),
        { id: project.id, name: project.name, slug: project.slug, countries: project.countries }
      ]
    ])
    setIsDirty(true)
  }

  const removeProject = (project) => {
    setProjects([...projects.filter(({ id }) => id !== project.id)])
    setIsDirty(true)
  }

  const onSubmit = () => {
    if (user) {
      const { userEmail, userToken } = user

      updateProductProjects({
        variables: {
          projectSlugs: projects.map(({ slug }) => slug),
          slug: product.slug
        },
        context: {
          headers: {
            'Accept-Language': locale,
            Authorization: `${userEmail} ${userToken}`
          }
        }
      })
    }
  }

  const onCancel = () => {
    setProjects(product.projects)
    setIsDirty(false)
  }

  const displayModeBody = projects.length
    ? <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-3'>
      {projects?.map((project, index) =>
        <ProjectCard
          key={index}
          project={project}
          displayType={DisplayType.SMALL_CARD}
        />
      )}
    </div>
    : <div className='text-sm text-dial-stratos'>
      {format( 'ui.common.detail.noData', {
        entity: format('ui.project.label'),
        base: format('ui.product.label')
      })}
    </div>

  const sectionHeader =
    <div className='text-xl font-semibold text-health-blue' ref={headerRef}>
      {format('ui.project.header')}
    </div>

  const editModeBody =
    <div className='px-4 lg:px-6 py-4 flex flex-col gap-y-3 text-sm'>

      <div className="flex flex-col gap-y-2">
        <div>
          {`${format('app.searchAndAssign')} ${format('ui.project.label')}`}
          <CreateButton
            className="float-right"
            label={format('app.createNew')}
            onClick={() => toggleCreateProjectDialog()}
          />
        </div>
      </div>
      <Select
        isSearch
        isBorderless
        defaultOptions
        cacheOptions
        placeholder={format('shared.select.autocomplete.defaultPlaceholder')}
        options={fetchedProjectsCallback(projectData)}
        noOptionsMessage={() => format('filter.searchFor', { entity: format('ui.project.label') })}
        onChange={addProject}
        onBlur={(e) => setProjectsInput(e.target.value)}
        value={null}
      />
      <div className='flex flex-wrap gap-3'>
        {projects.map((project, projectIdx) => (
          <Pill
            key={`projects-${projectIdx}`}
            label={project.name}
            onRemove={() => removeProject(project)}
          />
        ))}
      </div>
      <Dialog
        isOpen={isCreateProjectDialogOpen}
        onClose={toggleCreateProjectDialog}
        dialogType={DialogType.FORM}
      >
        <ProjectForm
          toggleCreateProjectDialog={toggleCreateProjectDialog}
          projectsInput={projectsInput}
        />
      </Dialog>
    </div>

  return (
    <EditableSection
      canEdit={canEdit}
      sectionHeader={sectionHeader}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isDirty={isDirty}
      isMutating={loading}
      displayModeBody={displayModeBody}
      editModeBody={editModeBody}
    />
  )
}

export default ProductDetailProjects
