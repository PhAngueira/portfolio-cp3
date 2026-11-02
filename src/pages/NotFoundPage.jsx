import { Link } from 'react-router-dom';
import Icon from '../components/Icon.jsx';

export default function NotFoundPage() {
  return (
    <section className="container error-page">
      <span className="error-number" aria-hidden="true">
        404<span>.</span>
      </span>
      <p className="eyebrow">PÁGINA NÃO ENCONTRADA</p>
      <h1>
        Este caminho ainda
        <br />
        não foi construído.
      </h1>
      <p>O endereço pode ter mudado ou ter sido digitado incorretamente.</p>
      <Link to="/" className="button button--primary">
        Voltar para o início
        <Icon name="arrow" />
      </Link>
    </section>
  );
}
