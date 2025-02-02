import { useState } from "react";
import { Field } from "@/components/ui/field";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { InputGroup } from "@/components/ui/input-group";
import { Box, Fieldset, Input } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { ILoginReqDTO, ILoginResponseDTO } from "@/components/Login/types";
import axiosClient from "@/config/axiosConfig";
import { USER_DATA } from "@/lib/constants";
import { useNavigate } from "react-router-dom";
import { toaster } from "@/components/ui/toaster";
import { useDataStore } from "@/store";
import { showError } from "@/lib/utils";

export const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);

  const setStoreField = useDataStore((store) => store.actions.setStoreField);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    try {
      const body: ILoginReqDTO = {
        email: email,
        password: password,
      };
      const res = await axiosClient.post<ILoginResponseDTO>(
        "/api/auth/login",
        body
      );

      localStorage.setItem(USER_DATA, JSON.stringify(res.data));
      setStoreField("user", res.data);

      toaster.create({
        title: `Login successful!`,
        type: "success",
      });
      navigate("/chats");
    } catch (err: unknown) {
      console.error("error: ", err);
      showError(err);
    }

    setLoading(false);
  };

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <Fieldset.Root size="lg">
          <Fieldset.Content>
            <Field label="Email">
              <Input
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  name="password"
                />
              </InputGroup>
            </Field>
            <Button type="submit" loading={loading}>
              Login
            </Button>
          </Fieldset.Content>
        </Fieldset.Root>
      </form>
    </Box>
  );
};
