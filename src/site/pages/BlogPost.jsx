import * as React from 'react'
import { compose, setDisplayName } from 'recompose'
import { withRouteData } from 'react-static'
import { Container } from 'reactstrap'

import Header from 'Site/components/Header'
import Footer from 'Site/components/Footer'

import { replaceStringWithJSX } from 'Utilities/display'

const parseParagraph = (p, title) => {
  if (p.text && p.markups.length == 0 && p.text !== title) {
    return (<p key={p.name}>{p.text}</p>)
  } else if (p.metadata) {
    return (
      <div className='text-center my-4'>
        <img 
          key={p.name} 
          style={{ maxWidth: '100%' }} 
          src={`https://cdn-images-1.medium.com/max/1600/${p.metadata.id}`} 
        />
      </div>
    )
  } else if (p.text && p.markups.length > 0) {
    if (p.markups[0].href) {
      const text = replaceStringWithJSX(
        p.text, 
        p.text.substring(p.markups[0].start, p.markups[0].end), 
        (match) => (
          <a href={p.markups[0].href}>{match}</a>
        )
      )
      return (
        <p>{text}</p>
      )
    }
  } else {
    console.log(p)
  }
}

export default compose(
  setDisplayName('BlogPost'),
  withRouteData
)(({ mediumPost: { payload: { value: { title, content: { bodyModel: { paragraphs } } } } } }) => (
  <Container>
    <Header />
    <div className='mx-auto' style={{ maxWidth: 1000 }}>
      <h2 className='mb-4 mt-5'>{title}</h2>
      {paragraphs.map(p => parseParagraph(p, title))}
    </div>
    <Footer />
  </Container>
))
