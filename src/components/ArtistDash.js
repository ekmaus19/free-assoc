import React, {Component} from 'react';
import { Card, Icon, Header,Image, Container, Segment, Sidebar, Menu , Grid, Button} from 'semantic-ui-react'



const SidebarExampleVisible = () => (
    
    <Sidebar.Pushable as={Segment}>
      <Sidebar 
      as={Menu} 
      animation='overlay' 
      icon='labeled' 
      direction='right'
      inverted 
      vertical 
      visible 
      width='thin'>
        <Menu.Item as='a'>
          <Icon name='file alternate' />
          Events
        </Menu.Item>
        <Menu.Item as='a'>
          <Icon name='edit' />
          New Event
        </Menu.Item>
        <Menu.Item as='a'>
          <Icon name='search' />
            Scout 
        </Menu.Item>
        <Menu.Item as='a'>
          <Icon name='chat' />
          Connect
        </Menu.Item>
        <Menu.Item as='map'>
          <Icon name='' />
          Map
        </Menu.Item>
       
      </Sidebar>
  
      <Sidebar.Pusher>
        <Segment basic >
          <Header as='h3'>Toggle Content</Header>
          <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
        </Segment>
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  )

class ArtistDash extends Component {
   constructor(props){
       super(props)
   }
    render(){
        return(
            <div> 
                      <Container style={{display:'flex'}}> 
                      <Button color = 'grey' className = "home-button"  animated onClick = {this.onHome}>
                          <Button.Content visible>Home</Button.Content>
                          <Button.Content hidden>
                            <Icon name='right arrow'   />
                          </Button.Content>
                        </Button>
                      </Container> 
                <Container> 
                <Grid>
                    <Grid.Row>
                    <Grid.Column width={4}>
                            <Container> 
                            <Card>
                              <Image src='https://react.semantic-ui.com/images/avatar/large/matthew.png' />
                              <Card.Content>
                                <Card.Header>{this.props.artist.firstName} {this.props.artist.lastName}</Card.Header>
                                <Card.Meta>
                                  <span className='date'>Joined in 2018</span>
                                </Card.Meta>
                                <Card.Description>
                                <h2> {this.props.artist.medium}</h2> 
                                <br /> 
                                {this.props.artist.bio}

                                <br /> 
                                {this.props.artist.existingWork}
                                
                                </Card.Description>
                              </Card.Content>
                              <Card.Content extra>
                                <a>
                                  <Icon name='user' />
                                  22 Friends
                                </a>
                              </Card.Content>
                            </Card>
                            </Container> 
                    </Grid.Column>
                    <Grid.Column width={12}>
                            <Container>
                                 <SidebarExampleVisible />
                            </Container> 
                    </Grid.Column>
                   </Grid.Row> 
                </Grid>
                </Container> 
       
            </div> 
        )
    }

}


// const mapStateToProps=(state)=>{
//     return {
//         artist: state 
//     }
// }

// const mapDispatchToProps = (dispatch) => {
//     return {
//         login: (artist)=> {
//             dispatch({type: "ARTISTINFO", artist})
//         }
//     }
// }

// ArtistDash = connect(
//     mapStateToProps,
//     mapDispatchToProps
//   )(ArtistDash);
  


export default ArtistDash