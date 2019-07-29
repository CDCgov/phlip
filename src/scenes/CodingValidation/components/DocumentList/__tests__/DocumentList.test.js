import React from 'react'
import { shallow } from 'enzyme'
import { DocumentList } from '../index'

const props = {
  actions: {
    getApprovedDocumentsRequest: jest.fn(),
    saveAnnotation: jest.fn(),
    getDocumentContentsRequest: jest.fn(),
    clearDocSelected: jest.fn(),
    removeAnnotation: jest.fn(),
    toggleCoderAnnotations: jest.fn(),
    toggleAnnotationMode: jest.fn(),
    downloadDocumentsRequest: jest.fn(),
    clearDownload: jest.fn(),
    clearApiError: jest.fn()
  },
  jurisdiction: { jurisdictionId: 1 },
  project: { id: 1 },
  page: 'coding',
  documents: [
    { name: 'doc1', _id: 12344 },
    { name: 'doc2', _id: 44321 }
  ],
  answerSelected: null,
  questionId: 3,
  annotatedDocs: [],
  docSelected: false,
  openedDoc: {},
  saveUserAnswer: jest.fn(),
  annotationModeEnabled: false,
  annotations: [],
  annotationUsers: [],
  isValidation: false,
  downloading: {
    id: '',
    content: '',
    name: ''
  }
}

describe('DocumentList', () => {
  test('should render DocumentList component correctly', () => {
    expect(shallow(<DocumentList {...props} />)).toMatchSnapshot()
  })
  
  test('should show PDFViewer when docSelected is true', () => {
    const wrapper = shallow(<DocumentList {...props} docSelected />)
    expect(wrapper.find('PDFViewer')).toHaveLength(1)
  })
  
  test('should have quote icons when document is in annotated list', () => {
    const wrapper = shallow(<DocumentList {...props} annotatedDocs={[12344]} />)
    expect(wrapper.find('Icon')).toHaveLength(1)
  })
  
  test('should clear selected doc when component unmounts', () => {
    const spy = jest.spyOn(props.actions, 'clearDocSelected')
    const wrapper = shallow(<DocumentList {...props} />)
    wrapper.unmount()
    expect(spy).toHaveBeenCalled()
  })
  
  describe('this.handleSaveAnnotation', () => {
    test('should call this.props.actions.saveAnnotation', () => {
      const spy = jest.spyOn(props.actions, 'saveAnnotation')
      const wrapper = shallow(<DocumentList {...props} enabledAnswerId={4} />)
      wrapper.instance().handleSaveAnnotation({ text: 'test annotation' })
      expect(spy).toHaveBeenCalledWith({ text: 'test annotation' }, 4, 3)
    })
    
    test('should call this.props.saveUserAnswer', () => {
      const spy = jest.spyOn(props, 'saveUserAnswer')
      const wrapper = shallow(<DocumentList {...props} enabledAnswerId={4} />)
      wrapper.instance().handleSaveAnnotation({ text: 'test annotation' })
      expect(spy).toHaveBeenCalled()
    })
    
    test('should disable annotation mode', () => {
      const spy = jest.spyOn(props.actions, 'toggleAnnotationMode')
      const wrapper = shallow(<DocumentList {...props} enabledAnswerId={4} />)
      wrapper.instance().handleSaveAnnotation({ text: 'test annotation' })
      expect(spy).toHaveBeenCalledWith(3, 4, false)
      spy.mockReset()
    })
  })
  
  describe('removing an annotation', () => {
    test('should remove the annotation', () => {
      const spy = jest.spyOn(props.actions, 'removeAnnotation')
      const wrapper = shallow(<DocumentList {...props} enabledAnswerId={4} />)
      wrapper.instance().handleRemoveAnnotation(5)
      expect(spy).toHaveBeenCalledWith(5, 4, 3)
    })
    
    test('should save the user\'s answer', () => {
      const spy = jest.spyOn(props, 'saveUserAnswer')
      const wrapper = shallow(<DocumentList {...props} enabledAnswerId={4} />)
      wrapper.instance().handleRemoveAnnotation(5)
      expect(spy).toHaveBeenCalled()
    })
    
    test('should disable annotation mode', () => {
      const spy = jest.spyOn(props.actions, 'toggleAnnotationMode')
      const wrapper = shallow(<DocumentList {...props} enabledAnswerId={4} />)
      wrapper.instance().handleRemoveAnnotation(5)
      expect(spy).toHaveBeenCalledWith(3, 4, false)
      spy.mockReset()
    })
  })
  
  describe('clicking a document', () => {
    test('should call props.getContents', () => {
      const spy = jest.spyOn(props.actions, 'getDocumentContentsRequest')
      const wrapper = shallow(<DocumentList {...props} />)
      const doc = wrapper.find('span').filterWhere(node => node.text() === 'doc1')
      doc.simulate('click')
      expect(spy).toHaveBeenCalledWith(12344)
    })
  })
  
  describe('when there are no docs', () => {
    test(
      'should show a view with text "There are no approved and/or assigned documents for this project and jurisdiction."',
      () => {
        const wrapper = shallow(<DocumentList {...props} showEmptyDocs documents={[]} />)
        const view = wrapper.find('WithStyles(Typography)')
          .filterWhere(node => node.childAt(0).text() ===
            'There are no approved or assigned documents for this project and jurisdiction.')
        expect(view.length).toEqual(1)
      }
    )
  })
  
  describe('this.handleRemoveAnnotation', () => {
    test('should call this.props.actions.removeAnnotation', () => {
      const spy = jest.spyOn(props.actions, 'removeAnnotation')
      const wrapper = shallow(<DocumentList {...props} enabledAnswerId={4} />)
      wrapper.instance().handleRemoveAnnotation(1)
      expect(spy).toHaveBeenCalledWith(1, 4, 3)
    })
    
    test('should call this.props.saveUserAnswer', () => {
      const spy = jest.spyOn(props, 'saveUserAnswer')
      const wrapper = shallow(<DocumentList {...props} enabledAnswerId={4} />)
      wrapper.instance().handleRemoveAnnotation(1)
      expect(spy).toHaveBeenCalled()
    })
  })
  
  describe('this.clearDocSelected', () => {
    test('should call props.actions.clearDocSelected', () => {
      const spy = jest.spyOn(props.actions, 'clearDocSelected')
      const wrapper = shallow(<DocumentList {...props} />)
      wrapper.instance().clearDocSelected()
      expect(spy).toHaveBeenCalled()
    })
    
    test('should set state.textContent to 2', () => {
      const wrapper = shallow(<DocumentList {...props} />)
      wrapper.instance().clearDocSelected()
      wrapper.update()
      expect(wrapper.state('noTextContent')).toEqual(2)
    })
  })
  
  describe('this.checkTextContent', () => {
    test('should set state.noTextContent to 0 if all items in noTextArr are true', () => {
      const wrapper = shallow(<DocumentList {...props} />)
      wrapper.instance().handleCheckTextContent([true, true, true])
      wrapper.update()
      expect(wrapper.state('noTextContent')).toEqual(0)
    })
    
    test('should set state.noTextContent to 2 if all items in noTextArr are false', () => {
      const wrapper = shallow(<DocumentList {...props} />)
      wrapper.instance().handleCheckTextContent([false, false, false])
      wrapper.update()
      expect(wrapper.state('noTextContent')).toEqual(2)
    })
    
    test('should set state.noTextContent to 1 if there is a mix of true and false items in noTextArr', () => {
      const wrapper = shallow(<DocumentList {...props} />)
      wrapper.instance().handleCheckTextContent([true, true, false])
      wrapper.update()
      expect(wrapper.state('noTextContent')).toEqual(1)
    })
  })
  
  describe('showing errors', () => {
    test('should show ApiErrorView component if there is an error', () => {
      const wrapper = shallow(<DocumentList {...props} apiError={{ text: '', open: true, alertOrView: 'view' }} />)
      expect(wrapper.find('ApiErrorView').length).toEqual(1)
    })
    
    test('should contain props.apiError.text content in ApiErrorView', () => {
      const wrapper = shallow(
        <DocumentList
          {...props}
          apiError={{ text: 'Failed to get documents.', open: true, alertOrView: 'view' }}
          documents={[]}
        />
      )
      expect(wrapper.find('ApiErrorView').prop('error')).toEqual('Failed to get documents.')
    })
    
    test('should show an alert if the error is an alert error', () => {
      const wrapper = shallow(<DocumentList {...props} apiError={{ text: 'alert', open: true, alertOrView: 'alert' }} />)
      expect(wrapper.find('ApiErrorAlert').prop('open')).toEqual(true)
    })
    
    test('should close the alert when the user clicks the dismiss button', () => {
      const spy = jest.spyOn(props.actions, 'clearApiError')
      const wrapper = shallow(<DocumentList {...props} apiError={{ text: 'alert', open: true, alertOrView: 'alert' }} />)
      wrapper.find('ApiErrorAlert').prop('onCloseAlert')()
      expect(spy).toHaveBeenCalled()
    })
  })
  
  describe('when a document has been selected but content is not available', () => {
    test('should change document name text color to #757575 for matching document', () => {
      const wrapper = shallow(<DocumentList {...props} openedDoc={{ _id: 12344, name: 'doc1' }} />)
      expect(wrapper.find('FlexGrid').at(6).childAt(1).prop('style').color).toEqual('#757575')
    })
    
    test('should not change document name text color for not matching documents', () => {
      const wrapper = shallow(<DocumentList {...props} openedDoc={{ _id: 12344, name: 'doc1' }} />)
      expect(wrapper.find('FlexGrid').at(8).childAt(1).prop('style').color).toEqual('#048484')
    })
    
    test('should add a spinner next to the selected document name', () => {
      const wrapper = shallow(<DocumentList {...props} openedDoc={{ _id: 12344, name: 'doc1' }} />)
      expect(wrapper.find('FlexGrid').at(6).find('CircularLoader').length).toEqual(1)
    })
  })
  
  describe('downloading documents', () => {
    test('should send a request to download all documents when the user clicks the download icon in the header', () => {
      const wrapper = shallow(<DocumentList {...props} />)
      const spy = jest.spyOn(props.actions, 'downloadDocumentsRequest')
      wrapper.find('IconButton').at(0).simulate('click')
      expect(spy).toHaveBeenCalledWith('all')
    })
    
    test(
      'should send a request to download a specific document when the user clicks the download icon next to a doc',
      () => {
        const wrapper = shallow(<DocumentList {...props} />)
        const spy = jest.spyOn(props.actions, 'downloadDocumentsRequest')
        wrapper.find('IconButton').at(2).simulate('click')
        expect(spy).toHaveBeenCalledWith(44321)
      }
    )
    
    test('should show a spinner next to a document to indicate that it is being downloaded', () => {
      const wrapper = shallow(<DocumentList {...props} downloading={{ id: 'all' }} />)
      expect(wrapper.find('FlexGrid').at(3).find('CircularLoader').length).toEqual(1)
    })
    
    test('should show a spinner to indicate that all are being downloaded', () => {
      const wrapper = shallow(<DocumentList {...props} downloading={{ id: 44321 }} />)
      expect(wrapper.find('FlexGrid').at(7).find('CircularLoader').length).toEqual(1)
    })
  })
  
  describe('loading documents', () => {
    const wrapper = shallow(<DocumentList {...props} gettingDocs />)
    
    test('should show \'Loading...\' text', () => {
      expect(wrapper.find('FlexGrid').at(5).childAt(0).childAt(0).text()).toEqual('Loading...')
    })
    
    test('should show a spinner to indicate that documents are being loaded', () => {
      expect(wrapper.find('FlexGrid').at(5).find('CircularLoader').length).toEqual(1)
    })
  })
  
  describe('Annotation banner', () => {
    test('text should be "Annotation Mode: Select a document to annotate." when no document is open', () => {
      const wrapper = shallow(<DocumentList {...props} annotationModeEnabled enabledAnswerId={4} />)
      const text = wrapper.childAt(2).childAt(0).childAt(0).childAt(0).text()
      expect(text).toEqual('Annotation Mode: Select a document to annotate.')
    })
    
    test(
      'text should be "Annotation Mode: Highlight the desired text and confirm." when a document with text selected is open',
      () => {
        const wrapper = shallow(<DocumentList {...props} enabledAnswerId={4} docSelected annotationModeEnabled />)
        const text = wrapper.childAt(2).childAt(0).childAt(0).childAt(0).text()
        expect(text).toEqual('Annotation Mode: Highlight the desired text and confirm.')
      }
    )
    
    test(
      'text should be "NOTE: You are unable to annotate this document. Text selection is not allowed." when a document with no text selection is open',
      () => {
        const wrapper = shallow(<DocumentList {...props} enabledAnswerId={4} docSelected annotationModeEnabled />)
        wrapper.setState({ noTextContent: 0 })
        const text = wrapper.childAt(2).childAt(0).childAt(0).childAt(0).text()
        expect(text).toEqual('NOTE: You are unable to annotate this document. Text selection is not allowed.')
      }
    )
    
    describe('document open with some text selection', () => {
      const wrapper = shallow(<DocumentList {...props} enabledAnswerId={4} docSelected annotationModeEnabled />)
      wrapper.setState({ noTextContent: 1 })
      
      test('there should be two text children', () => {
        expect(wrapper.childAt(2).childAt(0).children()).toHaveLength(2)
      })
      
      test('first text child should be "Annotation Mode: Highlight the desired text and confirm."', () => {
        const text = wrapper.childAt(2).childAt(0).childAt(0).childAt(0).text()
        expect(text).toEqual('Annotation Mode: Highlight the desired text and confirm.')
      })
      
      test(
        'second text child should be "Some pages of this document do not have text selection. You will not be able to annotate those pages."',
        () => {
          const text = wrapper.childAt(2).childAt(0).childAt(1).childAt(0).text()
          expect(text)
            .toEqual(
              'NOTE: Some pages of this document do not have text selection. You will not be able to annotate those pages.'
            )
        }
      )
    })
  })
})
