import {commonText} from '../../common';
import {consoleLog} from '../Helpers/HelperFunction';

export const genders = [
  {
    id: '1',
    name: 'Male',
  },
  {
    id: '2',
    name: 'Female',
  },
  {
    id: '3',
    name: 'Other',
  },
  {
    id: '4',
    name: 'Not Specified',
  },
];

export const SETTINGS = [
  {
    id: 1,
    title: 'Activation Mode',
    subTitle: 'On Demand',
    rightText: '30 Sec',
    route: 'ActivationMode',
  },
  {
    id: 2,
    title: 'Line Flush',
    subTitle: 'Off',
    rightText: '-',
    route: 'LineFlush',
  },
  {
    id: 3,
    title: 'Confirm Flow Rate',
    subTitle: 'Galons Per Minute',
    rightText: '0.5 gpm',
    route: 'FlowRate',
  },
  {
    id: 4,
    title: 'Sensor Range',
    subTitle: 'Units',
    rightText: '3',
    route: 'SensorRange',
  },
];

export const TABS = [
  {
    id: 1,
    iconType: 'Feather',
    icon: 'crosshair',
    iconSize: 23,
    title: 'Diagnostics',
    route: 'DeviceDiagnostics',
  },
  {
    id: 2,
    iconType: 'MaterialIcons',
    icon: 'list-alt',
    iconSize: 25,
    title: 'Details',
    route: 'DeviceInfo',
  },
  {
    id: 3,
    iconType: 'MaterialIcons',
    icon: 'help-outline',
    iconSize: 25,
    title: 'Help',
    route: 'DeviceHelp',
  },
  {
    id: 4,
    iconType: 'MaterialIcons',
    icon: 'power-settings-new',
    iconSize: 25,
    title: 'Disconnect',
    // route: null,
  },
];

export const helpData = `What are Terms and Conditions Agreements?
A Terms and Conditions agreement acts as a legal contract between you (the company) and the user. It's where you maintain your rights to exclude users from your app in the event that they abuse your website/app, set out the rules for using your service and note other important details and disclaimers.

Having a Terms and Conditions agreement is completely optional. No laws require you to have one. Not even the super-strict and wide-reaching General Data Protection Regulation (GDPR).

Your Terms and Conditions agreement will be uniquely yours. While some clauses are standard and commonly seen in pretty much every Terms and Conditions agreement, it's up to you to set the rules and guidelines that the user must agree to.

Terms and Conditions agreements are also known as Terms of Service or Terms of Use agreements. These terms are interchangeable, practically speaking. More rarely, it may be called something like an End User Services Agreement (EUSA).

Check out our Terms and Conditions FAQ article for more helpful insight into these important agreements.

You can use this agreement anywhere, regardless of what platform your business operates on:

Websites
WordPress blogs or blogs on any kind of platform: Joomla!, Drupal etc.
Ecommerce stores
Mobile apps
Facebook apps
Desktop apps
SaaS apps`;
export const invitation = `Questions or concerns? Reading this privacy notice will help you understand your privacy rights and choices. If you do not agree with our policies and practices, please do not use our Services. If you still have any questions or concerns, please contact us at owner@otterboutmyday.com `;
