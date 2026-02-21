import SecundaryHeader from "../components/SecundaryHeader";
import FormLogin from "../components/formLogin";

export default function Login() {
   return (
          <>
              <SecundaryHeader />
              <div className="mt-6">
                  <FormLogin />
              </div>
          </>
      )
  }