import React from "react";
import { Separator } from "@/components/ui/separator";

interface PersonalInformationProps {
  fullname: string;
  email: string;
  phone: string;
  address: string;
  onEdit: (section: string) => void;
}

export const PersonalInformation: React.FC<PersonalInformationProps> = ({
  fullname,
  email,
  phone,
  address,
  onEdit,
}) => {
  return (
    <>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            Personal Information
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Full Name</p>
            <p className="text-sm font-medium">{fullname}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Email address</p>
            <p className="text-sm font-medium">{email}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Phone</p>
            <p className="text-sm font-medium">
              {phone ? phone : "Not provided"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Address</p>
            <p className="text-sm font-medium">
              {address ? address : "Not provided"}
            </p>
          </div>
        </div>
      </div>

      <Separator />
    </>
  );
};
