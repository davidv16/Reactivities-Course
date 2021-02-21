import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity";
import {v4 as uuid} from 'uuid';

export default class ActivityStore {
  activityRegistry = new Map<string, Activity>();
  selectedActivity: Activity | undefined = undefined;
  editMode = false;
  loading = false;
  loadingInitial = false;

  constructor() {
    //this function is going to be used when this class is called
    makeAutoObservable(this)
  }

  //an action to return the activities sorted by date.
  get activitiesByDate() {
    return Array.from(this.activityRegistry.values()).sort((a, b) => 
      Date.parse(a.date) - Date.parse(b.date));
  }

  //action to load in the list of activities to populate our app
  loadActivities = async () => {
    //start loading symbol
    this.loadingInitial = true;
    try {
      //returns a list of activities
      const activities = await agent.Activities.list();
        //from the response, for each activity
        activities.forEach(activity => {
          //run the helper function to set the current activity
          //to the activity map
          this.setActivity(activity);
        })
        //turn of the loading
        this.setLoadingInitial(false);
    } catch (error) {
      console.log(error);
        //turn of the loading
        this.setLoadingInitial(false);
    }
  }

  //a function that gets a single activity
  loadActivity = async (id: string) => {
    //checks if the current activity exists
    let activity = this.getActivity(id);
    //if activity exists
    if(activity) {
      //set the activity to the selected Activity
      this.selectedActivity = activity;
    } else {
      //otherwise start loading
      this.loadingInitial = true;
      try {
        //and run the axios to get the single activity from the api
        activity = await agent.Activities.details(id);
        //run the helper function to set the current activity
        //to the activity map
        this.setActivity(activity);
        //set the activity to the selected Activity
        this.selectedActivity = activity;
        //set the loading symbol to false
        this.setLoadingInitial(false);
      } catch (error) {
        //otherwise catch the error.
        console.log(error);
        //set the loading symbol to false
        this.setLoadingInitial(false);
      }
    }

  }

  private setActivity = (activity: Activity) => {
    //each date from the activity should be split the text based on the T character
    //and we'll take the first part of what we split into
    //will return a numbered date and not the time information
    activity.date = activity.date.split('T')[0];
    //and we'll set the activity to the activityRegistry map above
    this.activityRegistry.set(activity.id, activity);
  }

  //a function that checks if we have the id passed
  private getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  }

  //action to turn the loading symbol on
  setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
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
        //set the new activity to the activityRegistry map
        this.activityRegistry.set(activity.id, activity);
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
        //sets the updated activity to the activityRegistry map
        this.activityRegistry.set(activity.id, activity);
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

  deleteActivity = async (id: string) => {
    //turn on loading
    this.loading = true;
    try {
      //sends a delete request with axios to the api with the id of the activity as a parameter
      await agent.Activities.delete(id);
      runInAction(() => {
        //deletes the activity that matches the id passed
        this.activityRegistry.delete(id);
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
  
}