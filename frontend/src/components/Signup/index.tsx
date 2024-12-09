import React, { useState } from "react";
import { Box, Fieldset, Input } from "@chakra-ui/react";
// import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { toaster } from "@/components/ui/toaster";
import { Field } from "@/components/ui/field";

import { FiEye, FiEyeOff } from "react-icons/fi";
import { InputGroup } from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import axios from "axios";
import axiosClient from "@/config/axiosConfig";
import { ISignUpReqDTO, ISignUpResponseDTO } from "@/components/Signup/types";
import { useNavigate } from "react-router-dom";
import { USER_DATA } from "@/lib/constants";
import { useDataStore } from "@/store";

interface IData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  img: File | null;
}

export const Signup = () => {
  const navigate = useNavigate();

  const [data, setData] = useState<IData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    img: null,
  });
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const setStoreField = useDataStore((store) => store.setStoreField);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (data.confirmPassword !== data.password) {
      toaster.create({
        title: `Passwords do not match!`,
        type: "error",
      });

      return;
    }
    // upload image to cloudinary first
    let imgUrl;

    setLoading(true);
    if (data.img) {
      if (data.img.type === "image/jpeg" || data.img.type === "image/png") {
        const formData = new FormData();
        formData.append("file", data.img);
        formData.append("upload_preset", "chat-app");
        formData.append("cloud_name", "omjcloud");

        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/omjcloud/image/upload",
          formData
        );
        console.log("Img uploaded: ", response.data.url.toString());
        imgUrl = response.data.url.toString();
      } else {
        toaster.create({
          title: `Only png and jpeg are supported`,
          type: "error",
        });
      }
    }

    try {
      const body: ISignUpReqDTO = {
        name: data.name,
        email: data.email,
        password: data.password,
        pic: imgUrl,
      };
      const res = await axiosClient.post<ISignUpResponseDTO>(
        "/api/auth/signup",
        body
      );

      localStorage.setItem(USER_DATA, JSON.stringify(res.data));

      setStoreField("user", res.data);
      navigate("/chats");
      toaster.create({
        title: `Sign up successful!`,
        type: "success",
      });
    } catch (err) {
      console.error("error: ", err);
    }

    setLoading(false);
  };

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <Fieldset.Root size="lg" maxW="md">
          <Fieldset.Content>
            <Field label="First Name" required>
              <Input
                id="name"
                name="name"
                value={data.name}
                onChange={handleChange}
              />
            </Field>

            <Field label="Email" required>
              <Input
                id="email"
                name="email"
                type="email"
                value={data.email}
                onChange={handleChange}
              />
            </Field>
            <Field label="Password" required>
              <InputGroup
                alignSelf="stretch"
                endElement={
                  isShowPassword ? (
                    <FiEye
                      onClick={() => setIsShowPassword(false)}
                      cursor="pointer"
                    />
                  ) : (
                    <FiEyeOff
                      onClick={() => setIsShowPassword(true)}
                      cursor="pointer"
                    />
                  )
                }
              >
                <Input
                  type={isShowPassword ? "text" : "password"}
                  value={data.password}
                  onChange={handleChange}
                  name="password"
                />
              </InputGroup>
            </Field>
            <Field label="Confirm password" required>
              <InputGroup
                alignSelf="stretch"
                endElement={
                  isShowConfirmPassword ? (
                    <FiEye
                      onClick={() => setIsShowConfirmPassword(false)}
                      cursor="pointer"
                    />
                  ) : (
                    <FiEyeOff
                      onClick={() => setIsShowConfirmPassword(true)}
                      cursor="pointer"
                    />
                  )
                }
              >
                <Input
                  type={isShowConfirmPassword ? "text" : "password"}
                  value={data.confirmPassword}
                  onChange={handleChange}
                  name="confirmPassword"
                />
              </InputGroup>
            </Field>
            <Field label="Profile Pic">
              <Input
                id="img"
                name="img"
                type="file"
                p={1.5}
                accept="image/*"
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    img: e.target.files?.[0] || null,
                  }))
                }
              />
            </Field>
            <Button type="submit" loading={loading}>
              Sign up
            </Button>
          </Fieldset.Content>
        </Fieldset.Root>
      </form>
    </Box>
  );
};
