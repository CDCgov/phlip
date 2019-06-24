import React from 'react'
import { shallow } from 'enzyme'
import { Upload } from '../index'
import LinearProgress from '@material-ui/core/LinearProgress'
import { CircularLoader } from 'components'
import { selectedDocs } from 'utils/testData/upload'

const props = {
  selectedDocs: [],
  uploadError: null,
  uploading: false,
  user: { firstName: 'test', lastName: 'user' },
  isReduxForm: false,
  history: {
    push: jest.fn()
  },
  onSubmitError: jest.fn(),
  actions: {
    acknowledgeUploadFailures: jest.fn(),
    clearSelectedFiles: jest.fn(),
    closeAlert: jest.fn(),
    openAlert: jest.fn(),
    projectAutocomplete: {
      clearAll: jest.fn()
    },
    jurisdictionAutocomplete: {
      clearAll: jest.fn()
    },
    uploadDocumentsStart: jest.fn(),
    verifyFiles: jest.fn(),
    addSelectedDocs: jest.fn(),
    mergeInfoWithDocs: jest.fn(),
    setInfoRequestProgress: jest.fn(),
    extractInfoRequest: jest.fn()
  },
  alert: {
    open: false,
    text: '',
    type: 'basic',
    title: ''
  },
  uploadProgress: {
    index: 0,
    total: 0,
    failures: false
  },
  maxFileCount: 20,
  infoRequestInProgress: false,
  infoSheetSelected: false
}

describe('Document Management - Upload scene', () => {
  test('should render correctly', () => {
    expect(shallow(<Upload {...props} />)).toMatchSnapshot()
  })
  
  test('should reset document name when component unmounts', () => {
    document.title = 'Document List'
    const wrapper = shallow(<Upload {...props} />)
    wrapper.unmount()
    expect(document.title).toEqual('Document List')
  })
  
  describe('Closing modal', () => {
    describe('When the user has added docs', () => {
      test('should show an unsaved changes modal if the user has selected docs', () => {
        const spy = jest.spyOn(props.actions, 'openAlert')
        const wrapper = shallow(<Upload {...props} selectedDocs={[{ name: 'doc1' }]} />)
        wrapper.find('WithStyles(Modal)').prop('onClose')()
        expect(spy).toHaveBeenCalledWith(
          'Your unsaved changes will be lost. Do you want to continue?',
          'Warning',
          'basic'
        )
        
        wrapper.setProps({
          alert: {
            open: true,
            text: 'Your unsaved changes will be lost. Do you want to continue?',
            title: 'Warning',
            type: 'basic'
          }
        })
        
        expect(wrapper.find('Alert').at(0).childAt(0).childAt(0).text())
          .toEqual('Your unsaved changes will be lost. Do you want to continue?')
      })
      
      test('should close alert and not go back if user clicks cancel', () => {
        const spy = jest.spyOn(props.actions, 'closeAlert')
        const wrapper = shallow(
          <Upload
            {...props}
            selectedDocs={[{ name: 'doc1' }]}
            alert={{
              open: true,
              text: 'Your unsaved changes will be lost. Do you want to continue?',
              title: 'Warning',
              type: 'basic'
            }}
          />
        )
        
        wrapper.find('Alert').at(0).prop('onCloseAlert')()
        expect(spy).toHaveBeenCalled()
      })
      
      test('should clear and close everything if the user clicks continue', () => {
        const wrapper = shallow(<Upload {...props} selectedDocs={[{ name: 'doc1' }]} />)
        const spy = jest.spyOn(wrapper.instance(), 'goBack')
        wrapper.find('WithStyles(Modal)').prop('onClose')()
        wrapper.setProps({
          alert: {
            open: true,
            text: 'Your unsaved changes will be lost. Do you want to continue?',
            title: 'Warning',
            type: 'basic'
          }
        })
        
        wrapper.update()
        wrapper.find('Alert').at(0).prop('actions')[0].onClick()
        expect(spy).toHaveBeenCalled()
      })
    })
    
    describe('When the user hasn\'t added docs', () => {
      test('should go back to document list', () => {
        const spy = jest.spyOn(props.history, 'push')
        const wrapper = shallow(<Upload {...props} />)
        wrapper.find('WithStyles(Modal)').prop('onClose')()
        expect(spy).toHaveBeenCalled()
      })
      
      test('should clear all jurisdiction suggestions', () => {
        const spy = jest.spyOn(props.actions.jurisdictionAutocomplete, 'clearAll')
        const wrapper = shallow(<Upload {...props} />)
        wrapper.find('WithStyles(Modal)').prop('onClose')()
        expect(spy).toHaveBeenCalled()
      })
      
      test('should clear all project suggestions', () => {
        const spy = jest.spyOn(props.actions.projectAutocomplete, 'clearAll')
        const wrapper = shallow(<Upload {...props} />)
        wrapper.find('WithStyles(Modal)').prop('onClose')()
        expect(spy).toHaveBeenCalled()
      })
      
      test('should close alert', () => {
        const spy = jest.spyOn(props.actions, 'closeAlert')
        const wrapper = shallow(<Upload {...props} />)
        wrapper.find('WithStyles(Modal)').prop('onClose')()
        expect(spy).toHaveBeenCalled()
      })
      
      test('should clear all docs', () => {
        const spy = jest.spyOn(props.actions, 'clearSelectedFiles')
        const wrapper = shallow(<Upload {...props} />)
        wrapper.find('WithStyles(Modal)').prop('onClose')()
        expect(spy).toHaveBeenCalled()
      })
    })
  })
  
  describe('Selecting files for upload', () => {
    const file1 = new File(['file 1'], 'file1.txt', { type: 'text/plain' })
    const file2 = new File(['file 2'], 'file2.txt', { type: 'text/plain' })
    
    const files = [file1, file2]
    
    const fileList = {
      target: {
        files: {
          length: 2,
          item: index => files[index]
        }
      }
    }
    
    const fileArr = [
      {
        name: 'file1.txt',
        lastModifiedDate: undefined,
        tags: [],
        effectiveDate: '',
        file: file1,
        citation: '',
        jurisdictions: { searchValue: '', suggestions: [], name: '' }
      },
      {
        name: 'file2.txt',
        lastModifiedDate: undefined,
        tags: [],
        file: file2,
        effectiveDate: '',
        citation: '',
        jurisdictions: { searchValue: '', suggestions: [], name: '' }
      }
    ]
    
    test('should send a request to verify files', () => {
      const wrapper = shallow(<Upload {...props} />)
      const spy = jest.spyOn(props.actions, 'verifyFiles')
      wrapper.find('FileUpload').at(0).dive().find('input').simulate('change', fileList)
      expect(spy).toHaveBeenCalledWith(fileArr)
    })
    
    test('should open an alert if user selects more documents than allowed', () => {
      const spy = jest.spyOn(props.actions, 'openAlert')
      const wrapper = shallow(<Upload {...props} />)
      wrapper.find('FileUpload').at(0).dive().find('input').simulate('change', {
        target: { files: { length: 21 } }
      })
      expect(spy).toHaveBeenCalled()
    })
    
    describe('if no excel is selected', () => {
      test('should just add selected files', () => {
        const wrapper = shallow(<Upload {...props} />)
        const spy = jest.spyOn(props.actions, 'addSelectedDocs')
        wrapper.find('FileUpload').at(0).dive().find('input').simulate('change', fileList)
        expect(spy).toHaveBeenCalled()
      })
    })
    
    describe('if an excel is selected', () => {
      const wrapper = shallow(<Upload {...props} infoSheetSelected infoSheet={{ name: 'blep.csv' }} />)
      const mergeSpy = jest.spyOn(props.actions, 'mergeInfoWithDocs')
      const infoSpy = jest.spyOn(props.actions, 'setInfoRequestProgress')
      wrapper.find('FileUpload').at(0).dive().find('input').simulate('change', fileList)
      
      test('should merge excel info with selected files', () => {
        expect(mergeSpy).toHaveBeenCalled()
      })
      
      test('should set there\'s a request in progress', () => {
        expect(infoSpy).toHaveBeenCalled()
      })
    })
  })
  
  describe('Uploading documents', () => {
    const docs = selectedDocs.map((doc, i) => ({
      ...doc,
      jurisdictions: {
        ...doc.jurisdictions,
        value: {
          ...doc.jurisdictions.value,
          id: i + 1
        }
      }
    }))
    
    const wrapper = shallow(
      <Upload
        {...props}
        selectedDocs={docs}
        selectedProject={{ id: 4 }}
        selectedJurisdiction={{}}
      />
    )
    
    const arrOfDocs = [
      {
        name: 'Children and Minors Motor Vehicles Communication.pdf',
        citation: '',
        effectiveDate: '',
        jurisdictions: [1],
        projects: [4]
      },
      {
        name: 'North Carolina Register, Aug. 2018.pdf',
        citation: '',
        effectiveDate: '',
        jurisdictions: [2],
        projects: [4]
      },
      {
        name: 'OAC 3701-52-04 eff. 5-3-07.pdf',
        citation: '',
        effectiveDate: '',
        jurisdictions: [3],
        projects: [4]
      },
      {
        name: 'Ohio - combined PDF.pdf',
        citation: '',
        effectiveDate: '',
        jurisdictions: [4],
        projects: [4]
      }
    ]
    
    test('should create an array of all documents correctly formed', () => {
      const spy = jest.spyOn(props.actions, 'uploadDocumentsStart')
      wrapper.find('WithStyles(ModalActions)').prop('actions')[1].onClick()
      expect(spy).toHaveBeenCalledWith(arrOfDocs)
    })
    
    test('should send a request to upload documents', () => {
      const spy = jest.spyOn(props.actions, 'uploadDocumentsStart')
      wrapper.find('WithStyles(ModalActions)').prop('actions')[1].onClick()
      expect(spy).toHaveBeenCalled()
    })
    
    test('should use the global jurisdiction if selected', () => {
      const spy = jest.spyOn(props.actions, 'uploadDocumentsStart')
      wrapper.setProps({
        selectedJurisdiction: { id: 20 }
      })
      
      wrapper.find('WithStyles(ModalActions)').prop('actions')[1].onClick()
      const globalJur = arrOfDocs.map(doc => ({
        ...doc,
        jurisdictions: [20]
      }))
      
      expect(spy).toHaveBeenCalledWith(globalJur)
    })
  })
  
  describe('Upload progress alert', () => {
    test('should show a progress alert with status when uploading', () => {
      const wrapper = shallow(<Upload {...props} uploading uploadProgress={{ index: 0, total: 3, failures: false }} />)
      expect(wrapper.find('Alert').at(0).childAt(0).childAt(0).text()).toEqual('Uploading document 1 out of 3')
      expect(wrapper.find('Alert').at(0).childAt(0).childAt(1).matchesElement(<LinearProgress />)).toEqual(true)
    })
    
    test('should inform user when all documents have uploaded', () => {
      const wrapper = shallow(<Upload {...props} uploading uploadProgress={{ index: 3, total: 3, failures: false }} />)
      expect(wrapper.find('Alert').at(0).childAt(0).childAt(0).text()).toEqual('All documents successfully uploaded!')
    })
    
    test('should inform the user of any failures', () => {
      const wrapper = shallow(<Upload {...props} uploading uploadProgress={{ index: 3, total: 3, failures: true }} />)
      expect(wrapper.find('Alert').at(0).childAt(0).childAt(0).text())
        .toEqual('Some of the documents failed to upload. They are still present in the list if you want to retry.')
    })
    
    test('should hide the alert close button if not done uploading', () => {
      const wrapper = shallow(<Upload {...props} uploading uploadProgress={{ index: 2, total: 3, failures: false }} />)
      expect(wrapper.find('Alert').at(0).prop('hideClose')).toEqual(true)
    })
    
    test('should display the alert close button when finished uploading', () => {
      const wrapper = shallow(<Upload {...props} uploading uploadProgress={{ index: 3, total: 3, failures: false }} />)
      expect(wrapper.find('Alert').at(0).prop('hideClose')).toEqual(false)
    })
    
    test('should close the upload modal when user acknowledges upload if there are no failures', () => {
      const spy = jest.spyOn(props.history, 'push')
      const wrapper = shallow(<Upload {...props} uploading uploadProgress={{ index: 3, total: 3, failures: false }} />)
      wrapper.find('Alert').at(0).prop('onCloseAlert')()
      expect(spy).toHaveBeenCalled()
    })
    
    test('should only close progress alert if there are failures', () => {
      const spy = jest.spyOn(props.actions, 'acknowledgeUploadFailures')
      const wrapper = shallow(<Upload {...props} uploading uploadProgress={{ index: 3, total: 3, failures: true }} />)
      wrapper.find('Alert').at(0).prop('onCloseAlert')()
      expect(spy).toHaveBeenCalled()
    })
  })
  
  describe('Selecting Excel file', () => {
    test('should send a request to extract info from file', () => {
      const file1 = new File(['file 1'], 'file1.csv', { type: 'text/plain' })
  
      const files = [file1]
  
      const fileList = {
        target: {
          files: {
            length: 1,
            item: index => files[index]
          }
        }
      }
      
      const wrapper = shallow(<Upload {...props} />)
      const spy = jest.spyOn(props.actions, 'extractInfoRequest')
      wrapper.find('FileUpload').at(1).dive().find('input').simulate('change', fileList)
      expect(spy).toHaveBeenCalled()
    })
  })
  
  describe('Extracting Excel metadata', () => {
    test('should show an progress spinner alert', () => {
      const wrapper = shallow(<Upload {...props} infoRequestInProgress />)
      expect(wrapper.find('Alert').at(0).childAt(0).childAt(0).text())
        .toEqual('Processing document... This could take a couple of minutes...')
      expect(wrapper.find('Alert').at(0).childAt(0).childAt(1).matchesElement(<CircularLoader />)).toEqual(true)
    })
    
    test('handle if there\'s an error while submitting', () => {
      const spy = jest.spyOn(props, 'onSubmitError')
      const wrapper = shallow(<Upload {...props} infoRequestInProgress />)
      wrapper.setProps({
        infoRequestInProgress: false,
        requestError: 'Failed to extract'
      })
      wrapper.update()
      expect(spy).toHaveBeenCalled()
    })
  })
})
