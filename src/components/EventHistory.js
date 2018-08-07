import React from 'react'
import { render } from 'react-dom';
import Gallery from 'react-grid-gallery';

const IMAGES =
[{
        src: "./img/music.jpg",
        thumbnail: "./img/music.jpg",
        thumbnailWidth: 200,
        thumbnailHeight: 200,
        isSelected: true,
        caption: "After Rain (Jeshu John - designerspics.com)"
},
{
        src: "./img/jazz.jpeg",
        thumbnail: "./img/jazz.jpeg",
        thumbnailWidth: 200,
        thumbnailHeight: 200,
        tags: [{value: "Ocean", title: "Ocean"}, {value: "People", title: "People"}],
        caption: "Boats (Jeshu John - designerspics.com)"
},

{
        src: "./img/speakeasy.jpg",
        thumbnail: "./img/speakeasy.jpg",
        thumbnailWidth: 200,
        thumbnailHeight: 200
}]



export default class EventHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({
      date: new Date()
    })
  }


  render() {
    return (
      <div>
        <Gallery images={IMAGES} backdropClosesModal={true} />
        {/* document.getElementById('example-0') */}
      </div>
    )
  }
}
