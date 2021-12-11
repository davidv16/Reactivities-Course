import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity";
import {v4 as uuid} from 'uuid';

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

  //async action for creating an activity
  //takes in a variable the type of Activity
  createActivity = async (activity: Activity) => {
    //turn on loading
    this.loading = true;
    //generates a new uuid for the new activity
    activity.id = uuid();
    try {
      //sends a create request with axios to the api with the new activity as a parameter
      await agent.Activities.create(activity);
      // to run the local properties we have to do run in action so we won't get an error
      runInAction(() => {
        //push the new activity to the activity array
        this.activities.push(activity);
        //set the selected activity to the new activity
        this.selectedActivity = activity;
        //turn off edit mode
        this.editMode = false;
        //turn of loading
        this.loading = false;
      })
    } catch (error) {
      console.log(error);
      runInAction(() => {
        //turn of loading
        this.loading = false;
      })
    }
  }

  //async action for updating an activity
  //takes in a variable of the type of Activity
  updateActivity = async (activity: Activity) => {
    //turn on loading
    this.loading = true;
    try {
      //sends an update request with axios to the api with the new activity as a parameter
      await agent.Activities.update(activity);
      // to run the local properties we have to do run in action so we won't get an error
      runInAction(() => {
        //filters out the activities that don't match with the new activity and pushes the new activity to the array
        this.activities = [...this.activities.filter(a => a.id !== activity.id), activity];
        //set the selected activity to the new activity
        this.selectedActivity = activity;
        //turn off edit mode
        this.editMode = false;
        //turn of loading
        this.loading = false;
      })
    } catch (error) {
      console.log(error);
      // to run the local properties we have to do run in action so we won't get an error
      runInAction(() => {
        //turn of loading
        this.loading = false;
      })
    }
  }
  
}