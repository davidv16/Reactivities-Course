import { makeAutoObservable } from "mobx";

export default class ActivityStore {
  title = 'hello from mobx';

  constructor() {
    //this function is going to be used when this class is called
    makeAutoObservable(this)
  }

  setTitle = () => {
    this.title = this.title + '!';
  }
}