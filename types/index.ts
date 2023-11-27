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
  attendance: { week1: boolean, week2: boolean, week3: boolean, week4: boolean }
  legacyFee: boolean | null; // Adjust the type to allow null values
  weeklyDues: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface cdsGroupInterface {
  id: string;
  name: string;
  corps: CorpInterface[] | corpObject[];
  amountPaid: number;
  createdAt: Date;
  updatedAt: Date;
}

type corpObject = {
  id: string
}