import { useIntl } from 'react-intl'
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { HtmlViewer } from '../../../components/shared/HtmlViewer'

const UseCaseDetailRight = forwardRef(({ useCase }, ref) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const descRef = useRef()
  const stepRef = useRef()
  const workflowRef = useRef()
  const sdgTargetRef = useRef()
  const buildingBlockRef = useRef()
  const tagRef = useRef()

  useImperativeHandle(ref, () => ([
    { value: 'ui.useCase.detail.description', ref: descRef },
    { value: 'ui.useCase.detail.steps', ref: stepRef },
    { value: 'ui.useCase.detail.workflows', ref: workflowRef },
    { value: 'ui.useCase.detail.sdgTargets', ref: sdgTargetRef },
    { value: 'ui.useCase.detail.buildingBlocks', ref: buildingBlockRef },
    { value: 'ui.useCase.detail.tags', ref: tagRef }
  ]), [])

  return (
    <div className='flex flex-col gap-y-4 py-8 px-6'>
      <div className='flex flex-col gap-y-3'>
        <div className='text-2xl font-semibold text-dial-blueberry' ref={descRef}>
          {format('ui.useCase.detail.description')}
        </div>
        <div className='block'>
          <HtmlViewer
            initialContent={useCase?.useCaseDescription?.description}
            editorId='use-case-detail'
          />
        </div>
      </div>
      <div className='flex flex-col gap-y-3'>
        <div className='text-2xl font-semibold text-dial-blueberry' ref={stepRef}>
          {format('ui.useCase.detail.steps')}
        </div>
        <div>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vitae dui felis.
          Fusce nec efficitur neque. Nulla arcu urna, interdum a pulvinar egestas, varius quis
          enim. Nam sed erat ut diam condimentum porttitor. Vivamus non viverra neque, nec
          finibus ipsum. Ut id lacus dui. Donec nunc eros, sodales placerat fringilla quis,
          maximus non nisi. Phasellus ligula neque, sollicitudin in erat vitae, aliquet dictum
          velit. Nulla ultricies erat sit amet auctor lacinia. Nunc tincidunt velit a porta
          bibendum. Ut justo tellus, fermentum sodales tristique eget, commodo ultricies risus.
          Pellentesque at ipsum nulla. Aliquam felis nulla, lacinia convallis fermentum et,
          gravida non ex.

          Fusce a turpis efficitur, placerat mi nec, euismod orci. Praesent quis eros vitae velit
          hendrerit molestie. Maecenas eget aliquet leo, quis luctus ipsum. Phasellus non augue
          dolor. Nunc dictum, justo non semper condimentum, neque sem varius nunc, sollicitudin
          eleifend quam lacus id nisl. Vestibulum luctus mollis dolor non condimentum. Phasellus
          pretium auctor est.

          Nulla ac mi aliquet, feugiat enim vitae, consequat purus. Quisque commodo non libero nec
          malesuada. Mauris eu sem lorem. Pellentesque habitant morbi tristique senectus et netus et
          malesuada fames ac turpis egestas. Donec eget nulla est. Quisque tincidunt metus ligula,
          pharetra bibendum nulla lacinia ac. Nunc at lacus eget justo imperdiet rutrum in et tellus.

          Cras aliquet nulla nibh, nec egestas urna ultrices in. Donec interdum neque a ex hendrerit,
          nec feugiat erat dapibus. Morbi in eleifend metus. Nunc interdum risus ut magna scelerisque
          scelerisque. Maecenas tincidunt hendrerit faucibus. Interdum et malesuada fames ac ante ipsum
          primis in faucibus. Phasellus in ullamcorper massa. Donec est erat, aliquam et dui in,
          bibendum finibus mi. Morbi tincidunt luctus neque, dapibus mollis elit faucibus vel. Duis
          semper ante a lectus vestibulum cursus. Donec nec fermentum elit, non imperdiet lectus.
          Maecenas non ex velit. Maecenas vulputate fringilla lectus, nec ultricies metus lobortis
          vel. Etiam quis auctor orci, ut condimentum sapien.

          Suspendisse volutpat sapien sit amet consectetur fermentum. Donec quis suscipit metus.
          Maecenas tincidunt euismod pulvinar. Vivamus auctor fermentum risus hendrerit bibendum.
          Praesent condimentum nunc a diam commodo, a feugiat ligula pharetra. Donec dolor tellus,
          mollis nec sem in, malesuada volutpat purus. Curabitur rutrum varius justo volutpat
          ultricies. Aenean sagittis id odio sed hendrerit.
        </div>
      </div>
      <div className='flex flex-col gap-y-3'>
        <div className='text-2xl font-semibold text-dial-blueberry' ref={workflowRef}>
          {format('ui.useCase.detail.workflows')}
        </div>
        <div>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vitae dui felis.
          Fusce nec efficitur neque. Nulla arcu urna, interdum a pulvinar egestas, varius quis
          enim. Nam sed erat ut diam condimentum porttitor. Vivamus non viverra neque, nec
          finibus ipsum. Ut id lacus dui. Donec nunc eros, sodales placerat fringilla quis,
          maximus non nisi. Phasellus ligula neque, sollicitudin in erat vitae, aliquet dictum
          velit. Nulla ultricies erat sit amet auctor lacinia. Nunc tincidunt velit a porta
          bibendum. Ut justo tellus, fermentum sodales tristique eget, commodo ultricies risus.
          Pellentesque at ipsum nulla. Aliquam felis nulla, lacinia convallis fermentum et,
          gravida non ex.

          Fusce a turpis efficitur, placerat mi nec, euismod orci. Praesent quis eros vitae velit
          hendrerit molestie. Maecenas eget aliquet leo, quis luctus ipsum. Phasellus non augue
          dolor. Nunc dictum, justo non semper condimentum, neque sem varius nunc, sollicitudin
          eleifend quam lacus id nisl. Vestibulum luctus mollis dolor non condimentum. Phasellus
          pretium auctor est.

          Nulla ac mi aliquet, feugiat enim vitae, consequat purus. Quisque commodo non libero nec
          malesuada. Mauris eu sem lorem. Pellentesque habitant morbi tristique senectus et netus et
          malesuada fames ac turpis egestas. Donec eget nulla est. Quisque tincidunt metus ligula,
          pharetra bibendum nulla lacinia ac. Nunc at lacus eget justo imperdiet rutrum in et tellus.

          Cras aliquet nulla nibh, nec egestas urna ultrices in. Donec interdum neque a ex hendrerit,
          nec feugiat erat dapibus. Morbi in eleifend metus. Nunc interdum risus ut magna scelerisque
          scelerisque. Maecenas tincidunt hendrerit faucibus. Interdum et malesuada fames ac ante ipsum
          primis in faucibus. Phasellus in ullamcorper massa. Donec est erat, aliquam et dui in,
          bibendum finibus mi. Morbi tincidunt luctus neque, dapibus mollis elit faucibus vel. Duis
          semper ante a lectus vestibulum cursus. Donec nec fermentum elit, non imperdiet lectus.
          Maecenas non ex velit. Maecenas vulputate fringilla lectus, nec ultricies metus lobortis
          vel. Etiam quis auctor orci, ut condimentum sapien.

          Suspendisse volutpat sapien sit amet consectetur fermentum. Donec quis suscipit metus.
          Maecenas tincidunt euismod pulvinar. Vivamus auctor fermentum risus hendrerit bibendum.
          Praesent condimentum nunc a diam commodo, a feugiat ligula pharetra. Donec dolor tellus,
          mollis nec sem in, malesuada volutpat purus. Curabitur rutrum varius justo volutpat
          ultricies. Aenean sagittis id odio sed hendrerit.
        </div>
      </div>
      <div className='flex flex-col gap-y-3'>
        <div className='text-2xl font-semibold text-dial-blueberry' ref={sdgTargetRef}>
          {format('ui.useCase.detail.sdgTargets')}
        </div>
        <div>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vitae dui felis.
          Fusce nec efficitur neque. Nulla arcu urna, interdum a pulvinar egestas, varius quis
          enim. Nam sed erat ut diam condimentum porttitor. Vivamus non viverra neque, nec
          finibus ipsum. Ut id lacus dui. Donec nunc eros, sodales placerat fringilla quis,
          maximus non nisi. Phasellus ligula neque, sollicitudin in erat vitae, aliquet dictum
          velit. Nulla ultricies erat sit amet auctor lacinia. Nunc tincidunt velit a porta
          bibendum. Ut justo tellus, fermentum sodales tristique eget, commodo ultricies risus.
          Pellentesque at ipsum nulla. Aliquam felis nulla, lacinia convallis fermentum et,
          gravida non ex.

          Fusce a turpis efficitur, placerat mi nec, euismod orci. Praesent quis eros vitae velit
          hendrerit molestie. Maecenas eget aliquet leo, quis luctus ipsum. Phasellus non augue
          dolor. Nunc dictum, justo non semper condimentum, neque sem varius nunc, sollicitudin
          eleifend quam lacus id nisl. Vestibulum luctus mollis dolor non condimentum. Phasellus
          pretium auctor est.

          Nulla ac mi aliquet, feugiat enim vitae, consequat purus. Quisque commodo non libero nec
          malesuada. Mauris eu sem lorem. Pellentesque habitant morbi tristique senectus et netus et
          malesuada fames ac turpis egestas. Donec eget nulla est. Quisque tincidunt metus ligula,
          pharetra bibendum nulla lacinia ac. Nunc at lacus eget justo imperdiet rutrum in et tellus.

          Cras aliquet nulla nibh, nec egestas urna ultrices in. Donec interdum neque a ex hendrerit,
          nec feugiat erat dapibus. Morbi in eleifend metus. Nunc interdum risus ut magna scelerisque
          scelerisque. Maecenas tincidunt hendrerit faucibus. Interdum et malesuada fames ac ante ipsum
          primis in faucibus. Phasellus in ullamcorper massa. Donec est erat, aliquam et dui in,
          bibendum finibus mi. Morbi tincidunt luctus neque, dapibus mollis elit faucibus vel. Duis
          semper ante a lectus vestibulum cursus. Donec nec fermentum elit, non imperdiet lectus.
          Maecenas non ex velit. Maecenas vulputate fringilla lectus, nec ultricies metus lobortis
          vel. Etiam quis auctor orci, ut condimentum sapien.

          Suspendisse volutpat sapien sit amet consectetur fermentum. Donec quis suscipit metus.
          Maecenas tincidunt euismod pulvinar. Vivamus auctor fermentum risus hendrerit bibendum.
          Praesent condimentum nunc a diam commodo, a feugiat ligula pharetra. Donec dolor tellus,
          mollis nec sem in, malesuada volutpat purus. Curabitur rutrum varius justo volutpat
          ultricies. Aenean sagittis id odio sed hendrerit.
        </div>
      </div>
      <div className='flex flex-col gap-y-3'>
        <div className='text-2xl font-semibold text-dial-blueberry' ref={buildingBlockRef}>
          {format('ui.useCase.detail.buildingBlocks')}
        </div>
        <div>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vitae dui felis.
          Fusce nec efficitur neque. Nulla arcu urna, interdum a pulvinar egestas, varius quis
          enim. Nam sed erat ut diam condimentum porttitor. Vivamus non viverra neque, nec
          finibus ipsum. Ut id lacus dui. Donec nunc eros, sodales placerat fringilla quis,
          maximus non nisi. Phasellus ligula neque, sollicitudin in erat vitae, aliquet dictum
          velit. Nulla ultricies erat sit amet auctor lacinia. Nunc tincidunt velit a porta
          bibendum. Ut justo tellus, fermentum sodales tristique eget, commodo ultricies risus.
          Pellentesque at ipsum nulla. Aliquam felis nulla, lacinia convallis fermentum et,
          gravida non ex.

          Fusce a turpis efficitur, placerat mi nec, euismod orci. Praesent quis eros vitae velit
          hendrerit molestie. Maecenas eget aliquet leo, quis luctus ipsum. Phasellus non augue
          dolor. Nunc dictum, justo non semper condimentum, neque sem varius nunc, sollicitudin
          eleifend quam lacus id nisl. Vestibulum luctus mollis dolor non condimentum. Phasellus
          pretium auctor est.

          Nulla ac mi aliquet, feugiat enim vitae, consequat purus. Quisque commodo non libero nec
          malesuada. Mauris eu sem lorem. Pellentesque habitant morbi tristique senectus et netus et
          malesuada fames ac turpis egestas. Donec eget nulla est. Quisque tincidunt metus ligula,
          pharetra bibendum nulla lacinia ac. Nunc at lacus eget justo imperdiet rutrum in et tellus.

          Cras aliquet nulla nibh, nec egestas urna ultrices in. Donec interdum neque a ex hendrerit,
          nec feugiat erat dapibus. Morbi in eleifend metus. Nunc interdum risus ut magna scelerisque
          scelerisque. Maecenas tincidunt hendrerit faucibus. Interdum et malesuada fames ac ante ipsum
          primis in faucibus. Phasellus in ullamcorper massa. Donec est erat, aliquam et dui in,
          bibendum finibus mi. Morbi tincidunt luctus neque, dapibus mollis elit faucibus vel. Duis
          semper ante a lectus vestibulum cursus. Donec nec fermentum elit, non imperdiet lectus.
          Maecenas non ex velit. Maecenas vulputate fringilla lectus, nec ultricies metus lobortis
          vel. Etiam quis auctor orci, ut condimentum sapien.

          Suspendisse volutpat sapien sit amet consectetur fermentum. Donec quis suscipit metus.
          Maecenas tincidunt euismod pulvinar. Vivamus auctor fermentum risus hendrerit bibendum.
          Praesent condimentum nunc a diam commodo, a feugiat ligula pharetra. Donec dolor tellus,
          mollis nec sem in, malesuada volutpat purus. Curabitur rutrum varius justo volutpat
          ultricies. Aenean sagittis id odio sed hendrerit.
        </div>
      </div>
      <div className='flex flex-col gap-y-3'>
        <div className='text-2xl font-semibold text-dial-blueberry' ref={tagRef}>
          {format('ui.useCase.detail.tags')}
        </div>
        <div>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vitae dui felis.
          Fusce nec efficitur neque. Nulla arcu urna, interdum a pulvinar egestas, varius quis
          enim. Nam sed erat ut diam condimentum porttitor. Vivamus non viverra neque, nec
          finibus ipsum. Ut id lacus dui. Donec nunc eros, sodales placerat fringilla quis,
          maximus non nisi. Phasellus ligula neque, sollicitudin in erat vitae, aliquet dictum
          velit. Nulla ultricies erat sit amet auctor lacinia. Nunc tincidunt velit a porta
          bibendum. Ut justo tellus, fermentum sodales tristique eget, commodo ultricies risus.
          Pellentesque at ipsum nulla. Aliquam felis nulla, lacinia convallis fermentum et,
          gravida non ex.

          Fusce a turpis efficitur, placerat mi nec, euismod orci. Praesent quis eros vitae velit
          hendrerit molestie. Maecenas eget aliquet leo, quis luctus ipsum. Phasellus non augue
          dolor. Nunc dictum, justo non semper condimentum, neque sem varius nunc, sollicitudin
          eleifend quam lacus id nisl. Vestibulum luctus mollis dolor non condimentum. Phasellus
          pretium auctor est.

          Nulla ac mi aliquet, feugiat enim vitae, consequat purus. Quisque commodo non libero nec
          malesuada. Mauris eu sem lorem. Pellentesque habitant morbi tristique senectus et netus et
          malesuada fames ac turpis egestas. Donec eget nulla est. Quisque tincidunt metus ligula,
          pharetra bibendum nulla lacinia ac. Nunc at lacus eget justo imperdiet rutrum in et tellus.

          Cras aliquet nulla nibh, nec egestas urna ultrices in. Donec interdum neque a ex hendrerit,
          nec feugiat erat dapibus. Morbi in eleifend metus. Nunc interdum risus ut magna scelerisque
          scelerisque. Maecenas tincidunt hendrerit faucibus. Interdum et malesuada fames ac ante ipsum
          primis in faucibus. Phasellus in ullamcorper massa. Donec est erat, aliquam et dui in,
          bibendum finibus mi. Morbi tincidunt luctus neque, dapibus mollis elit faucibus vel. Duis
          semper ante a lectus vestibulum cursus. Donec nec fermentum elit, non imperdiet lectus.
          Maecenas non ex velit. Maecenas vulputate fringilla lectus, nec ultricies metus lobortis
          vel. Etiam quis auctor orci, ut condimentum sapien.

          Suspendisse volutpat sapien sit amet consectetur fermentum. Donec quis suscipit metus.
          Maecenas tincidunt euismod pulvinar. Vivamus auctor fermentum risus hendrerit bibendum.
          Praesent condimentum nunc a diam commodo, a feugiat ligula pharetra. Donec dolor tellus,
          mollis nec sem in, malesuada volutpat purus. Curabitur rutrum varius justo volutpat
          ultricies. Aenean sagittis id odio sed hendrerit.
        </div>
      </div>
    </div>
  )
})

UseCaseDetailRight.displayName = 'UseCaseDetailRight'

export default UseCaseDetailRight
