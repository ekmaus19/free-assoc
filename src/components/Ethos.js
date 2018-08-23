import React, {Component} from 'react';


class Ethos extends Component {

    render(){
        return(
            <div >
            <div style={{display:'inline-block',width:'100%', height:'300px', justifyContent:'center', alignItems:'center'}}> 
                <div className='Ethos' style={{margin:'50px',display:'inline-block',width:'800px', justifyContent:'center',textAlign:'center'}} > 
                
                     A platform for Artists to grow
                </div> 
                <br /> 
                <div className='Ethos2' style={{margin:'50px',display:'inline-block',width:'800px', justifyContent:'center',textAlign:'center'}} > 
                
                    And for others to find them...
                </div> 
            </div> 

            <div className='Ethosbox' style={{display:'flex',justifyContent:'center',width:'100%',backgroundColor:'white', height:'170px'}}> 
                <div  style={{display:'block',width:'400px',height:'100px', justifyContent:'center',textAlign:'left', margin:'50px'}} > 
                 We want to foster a collaborative and supportive and unbiased network of people  
                </div> 
                <div style={{display:'block',width:'400px',height:'100px',justifyContent:'center',textAlign:'left', margin:'50px'}} > 
                     We want to break down traditional biases and hierarchies that exist in the art world 
                </div> 
                <div style={{display:'block',width:'400px',height:'100px',justifyContent:'center',textAlign:'left', margin:'50px'}} > 
                 We want to ensure the safety of Users and Artists 
                </div> 
            </div> 

            <div className='Ethosbox' style={{display:'flex',justifyContent:'center',width:'100%',backgroundColor:'white', height:'200px'}}> 
                <div style={{display:'block',width:'400px',height:'100px',justifyContent:'center',textAlign:'left', margin:'50px'}} > 
                 We want to connect the Artist Community 
                </div> 
                <div style={{display:'block',width:'400px',height:'100px', justifyContent:'center',textAlign:'left', margin:'50px'}} > 
                 We want to show the resources that already exist in a given community 
                </div> 
                <div style={{display:'block',width:'400px',height:'100px', justifyContent:'center',textAlign:'left', margin:'50px'}} > 
                 We want to provide immediate access 
                </div> 
            
            </div> 

            <div className='Ethos2' style={{display:'inline-block',justifyContent:'center',width:'1000px', height:'250px', alignItems:'center',marginTop:'50px'}}> 
                <h1> To make art accessible and affordable for as many people as possible </h1>
            </div> 

            </div>
        )

    }
}

export default Ethos;
