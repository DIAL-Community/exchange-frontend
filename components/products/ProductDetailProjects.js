import { useApolloClient, useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useUser } from '../../lib/hooks'
import { ToastContext } from '../../lib/ToastContext'
import { UPDATE_PRODUCT_PROJECTS } from '../../mutations/product'
import { PROJECT_SEARCH_QUERY } from '../../queries/project'
import { fetchSelectOptions } from '../../queries/utils'
import ProjectCard from '../projects/ProjectCard'
import EditableSection from '../shared/EditableSection'
import Pill from '../shared/Pill'
import Select from '../shared/Select'

const ProductDetailProjects = ({ product, canEdit }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const client = useApolloClient()

  const [projects, setProjects] = useState(product.currentProjects)

  const [isDirty, setIsDirty] = useState(false)

  const [updateProductProjects, { data, loading }] = useMutation(UPDATE_PRODUCT_PROJECTS, {
    onCompleted: (data) => {
      const { updateProductProjects: response } = data
      if (response?.product && response?.errors?.length === 0) {
        setIsDirty(false)
        setProjects(data.updateProductProjects.product.projects)
        showToast(format('toast.projects.updated'), 'success', 'top-center')
      } else {
        setIsDirty(false)
        setProjects(product.currentProjects)
        showToast(format('toast.projects.update.failure'), 'error', 'top-center')
      }
    },
    onError() {
      setIsDirty(false)
      setProjects(product.currentProjects)
      showToast(format('toast.projects.update.failure'), 'error', 'top-center')
    }
  })

  const { user } = useUser()

  const { locale } = useRouter()

  const { showToast } = useContext(ToastContext)

  const fetchedProjectsCallback = (data) => (
    data.projects.map((project) => ({
      label: project.name,
      value: project.id,
      slug: project.slug,
      origin: project.origin
    }))
  )

  const addProject = (project) => {
    setProjects([
      ...projects.filter(({ slug }) => slug !== project.slug),
      { name: project.label, slug: project.slug, origin: project.origin }
    ])
    setIsDirty(true)
  }

  const removeProject = (project) => {
    setProjects([...projects.filter(({ slug }) => slug !== project.slug)])
    setIsDirty(true)
  }

  const onSubmit = () => {
    if (user) {
      const { userEmail, userToken } = user

      updateProductProjects({
        variables: {
          slug: product.slug,
          projectSlugs: projects.map(({ slug }) => slug)
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
    setProjects(data?.updateProductProjects?.product?.projects ?? product.currentProjects)
    setIsDirty(false)
  }

  const displayModeBody = projects.length > 0
    ? (
      <div className='grid grid-cols-1'>
        {projects.map((project, projectIdx) => <ProjectCard key={projectIdx} project={project} listType='list' />)}
      </div>
    ) : (
      <div className='text-sm pb-5 text-button-gray'>
        {format('product.no-project')}
      </div>
    )

  const editModeBody =
    <>
      <p className='card-title text-dial-stratos mb-3'>
        {format('app.assign')} {format('project.header')}
      </p>
      <label className='flex flex-col gap-y-2 mb-2' data-testid='project-search'>
        {`${format('app.searchAndAssign')} ${format('project.header')}`}
        <Select
          async
          isSearch
          defaultOptions
          cacheOptions
          placeholder={format('shared.select.autocomplete.defaultPlaceholder')}
          loadOptions={(input) => fetchSelectOptions(client, input, PROJECT_SEARCH_QUERY, fetchedProjectsCallback)}
          noOptionsMessage={() => format('filter.searchFor', { entity: format('project.header') })}
          onChange={addProject}
          value={null}
        />
      </label>
      <div className='flex flex-wrap gap-3 mt-5'>
        {projects.map((project, projectIdx) => (
          <Pill
            key={`project-${projectIdx}`}
            label={project.name}
            onRemove={() => removeProject(project)}
          />
        ))}
      </div>
    </>

  return (
    <EditableSection
      canEdit={canEdit}
      sectionHeader={format('project.header')}
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
