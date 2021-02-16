import { makeObservable, observable } from "mobx";

export default class ActivityStore {
  title = 'hello from mobx';

  constructor() {
    //this function is going to be used when this class is called
    makeObservable(this, {
      //this is observable
      title: observable
    })
  }
}