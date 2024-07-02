import React from "react";
import SupabaseLogo from "../components/SupabaseLogo";
import { login } from "./action";

const LoginPage: React.FC = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-100">
      <div className="bg-white rounded-md shadow-lg p-8 border border-gray-200 w-80">
        <div className="flex justify-center mb-6">
          <SupabaseLogo />
        </div>
        <form className="flex flex-col gap-4">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required />
          <Separator />
          <Button type="submit" formAction={login}>
            Log in
          </Button>
        </form>
      </div>
    </main>
  );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Button: React.FC<ButtonProps> = ({ children, ...rest }) => (
  <button
    className="rounded-md bg-blue-600 text-white font-semibold px-4 py-2 border border-transparent hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
    {...rest}
  >
    {children}
  </button>
);

const Input: React.FC<InputProps> = ({ ...rest }) => (
  <input
    className="rounded-md px-4 py-2 border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-150 ease-in-out"
    {...rest}
  />
);

const Label: React.FC<LabelProps> = ({ children, ...rest }) => (
  <label {...rest} className="text-sm text-gray-600">
    {children}
  </label>
);

const Separator: React.FC = () => <hr className="border-gray-300 my-4" />;

export default LoginPage;
