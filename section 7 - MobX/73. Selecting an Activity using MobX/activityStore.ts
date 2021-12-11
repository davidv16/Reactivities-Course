import { makeAutoObservable } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity";

export default class ActivityStore {
  activities: Activity[] = [];
  selectedActivity: Activity | undefined = undefined;
  editMode = false;
  loading = false;
  loadingInitial = false;

  constructor() {
    //this function is going to be used when this class is called
    makeAutoObservable(this)
  }

  loadingActivities = async () => {
    this.setLoadingInitial(true);
    try {
      //returns a list of activities
      const activities = await agent.Activities.list();
        //from the response, for each activity
        activities.forEach(activity => {
          //each date from the activity should be split the text based on the T character
          //and we'll take the first part of what we split into
          //will return a numbered date and not the time information
          activity.date = activity.date.split('T')[0];
          //and we'll push our activity into the activities array above
          this.activities.push(activity);
        })
        //turn of the loading
        this.setLoadingInitial(false);
    } catch (error) {
      console.log(error);
        //turn of the loading
        this.setLoadingInitial(false);
    }
  }

  //action to turn the loading symbol on
  setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
  }

  //action to find the selected id
  selectActivity = (id: string) => {
    //find the id in the memory that matches the id being passed
    this.selectedActivity = this.activities.find(a => a.id === id);
  }
  //action to cancel the selected activity
  cancelSelectedActivity = () => {
    this.selectedActivity = undefined
  }
  //action to open the form
  //takes in optional id
  openForm = (id?: string) => {
    //if id exists then pass the id to the selected activity
    //else cancel the selected activity
    id ? this.selectActivity(id) : this.cancelSelectedActivity();
    //turn the edit mode on.
    this.editMode = true;
  }
  
  //action to close the form
  closeForm = () => {
    this.editMode = false;
  }
  
}