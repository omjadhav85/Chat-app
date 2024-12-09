import { InputGroup } from "@/components/ui/input-group";
import { Input } from "@chakra-ui/react";
import React from "react";
import { LuSearch } from "react-icons/lu";

export const SearchUsers = () => {
  return (
    <>
      <InputGroup endElement={<LuSearch />}>
        <Input
          placeholder="Search name"
          borderRadius="4xl"
          backgroundColor="#F3F6FF"
          outline="none"
          border="none"
        />
      </InputGroup>
    </>
  );
};
