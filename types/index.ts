// import { Document } from "mongoose";
import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface CorpInterface {
  id: string;
  fullName: string;
  stateCode: string;
  cdsGroup?: string;
  cdsGroupId: string;
  ppa: string;
  state: string;
  university: string;
  course: string;
  phone: string;
  role: string;
  email?: string;
  password?: string;
  attendance: { week1: boolean, week2: boolean, week3: boolean, week4: boolean }
  legacyFee: boolean; // Adjust the type to allow null values
  weeklyDues: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface cdsGroupInterface {
  id: string;
  name: string;
  corps: CorpInterface[] | corpObject[];
  amountPaid: number;
  legacyFee: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface userInterface {
  id: string;
  email: string;
  name: string;
  phone: string;
  password: string;
  role: string;
}

export type corpObject = {
  id: string
  fullName: string;
  role: string;
  stateCode: string;
  phone: string;
}