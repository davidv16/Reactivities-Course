import React, { useEffect, useState } from 'react'
import { Header, List } from 'semantic-ui-react'
import axios from 'axios'



function App() {
  //useState is a react hook
  //we set the state to activities
  //and provide the hook with a function that is used to set the state "setActivities"
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5051/api/activities')
      .then((response) => {
        setActivities(response.data);
      })
  }, [])

    return (
      <div>
        <Header as='h2' icon="users" content="Reactivities" />
        
        <List>
        {activities.map((activity: any) => (
          <List.Item key={activity.id}>
            {activity.title}
          </List.Item>
          ))}
        </List>
      </div>
    );
}

export default App;