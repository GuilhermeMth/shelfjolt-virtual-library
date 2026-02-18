import SecundaryHeader from "../components/SecundaryHeader";
import FormCadastro from "../components/formCadastro";

export default function cadastro() {
    return (
        <>
            <SecundaryHeader />
            <div className="mt-6">
                <FormCadastro />
            </div>
        </>
    )
}