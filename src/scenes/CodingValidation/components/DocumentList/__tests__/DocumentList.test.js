import React from 'react'
import { shallow } from 'enzyme'
import { DocumentList } from '../index'

const props = {
  actions: {
    getApprovedDocumentsRequest: jest.fn(),
    saveAnnotation: jest.fn()
  },
  jurisdictionId: 1,
  projectId: 1,
  page: 'coding',
  documents: [
    { name: 'doc1', _id: 12344 }
  ],
  answerSelected: null,
  questionId: 3,
  annotatedDocs: [],
  docSelected: false,
  openedDoc: {},
  saveUserAnswer: jest.fn()
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

  test('should call this.props.saveAnnotation when this.onSaveAnnotation is called', () => {
    const spy = jest.spyOn(props.actions, 'saveAnnotation')
    const wrapper = shallow(<DocumentList {...props} answerSelected={4} />)
    wrapper.instance().onSaveAnnotation({ text: 'test annotation' })
    expect(spy).toHaveBeenCalledWith({ text: 'test annotation' }, 4, 3)
  })

  test('should call this.props.saveUserAnswer when this.onSaveAnnotation is called', () => {
    const spy = jest.spyOn(props, 'saveUserAnswer')
    const wrapper = shallow(<DocumentList {...props} answerSelected={4} />)
    wrapper.instance().onSaveAnnotation({ text: 'test annotation' })
    expect(spy).toHaveBeenCalled()
  })

  describe('Annotation banner', () => {
    test('text should be "Annotation Mode: Select a document to annotate." when no document is open', () => {
      const wrapper = shallow(<DocumentList {...props} answerSelected={4} />)
      const text = wrapper.childAt(2).childAt(0).childAt(0).childAt(0).text()
      expect(text).toEqual('Annotation Mode: Select a document to annotate.')
    })

    test('text should be "Annotation Mode: Highlight the desired text and confirm." when a document with text selected is open', () => {
      const wrapper = shallow(<DocumentList {...props} answerSelected={4} docSelected />)
      const text = wrapper.childAt(2).childAt(0).childAt(0).childAt(0).text()
      expect(text).toEqual('Annotation Mode: Highlight the desired text and confirm.')
    })

    test('text should be "NOTE: This document does not have text selection. You will not be able to annotate." when a document with no text selection is open', () => {
      const wrapper = shallow(<DocumentList {...props} answerSelected={4} docSelected />)
      wrapper.setState({ noTextContent: 0 })
      const text = wrapper.childAt(2).childAt(0).childAt(0).childAt(0).text()
      expect(text).toEqual('NOTE: This document does not have text selection. You will not be able to annotate.')
    })

    describe('document open with some text selection', () => {
      const wrapper = shallow(<DocumentList {...props} answerSelected={4} docSelected />)
      wrapper.setState({ noTextContent: 1 })

      test('there should be two text children', () => {
        expect(wrapper.childAt(2).childAt(0).children()).toHaveLength(2)
      })

      test('first text child should be "Annotation Mode: Highlight the desired text and confirm."', () => {
        const text = wrapper.childAt(2).childAt(0).childAt(0).childAt(0).text()
        expect(text).toEqual('Annotation Mode: Highlight the desired text and confirm.')
      })

      test('second text child should be "Some pages of this document do not have text selection. You will not be able to annotate those pages."', () => {
        const text = wrapper.childAt(2).childAt(0).childAt(1).childAt(0).text()
        expect(text).toEqual('NOTE: Some pages of this document do not have text selection. You will not be able to annotate those pages.')
      })
    })
  })
})