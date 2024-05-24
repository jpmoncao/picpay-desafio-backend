import ICarteiraRepo from "../database/repos/CarteiraRepo.js";
import CarteiraProps from "../database/domain/carteira.js";
import UseCase from "../types/UseCase.js";

import { CarteiraMissingDataError, CarteiraNotFoundError } from "../errors/Carteira.js";

export default class EditCarteira {
    repository: ICarteiraRepo;

    constructor(repository: ICarteiraRepo) {
        this.repository = repository;
    }

    async execute(props: CarteiraProps): Promise<UseCase> {
        let { id_user, id_carteira, saldo, lojista } = props;

        if (!id_user || id_user == 0 &&
            !id_carteira || id_carteira == 0)
            throw new CarteiraMissingDataError('O ID da carteira à alterar não foi informado!');

        if (!saldo && !lojista && lojista !== false)
            throw new CarteiraMissingDataError('Os dados à alterar não foram passados');

        let carteira: CarteiraProps | undefined;
        id_carteira = id_carteira ?? 0;
        id_user = id_user ?? 0;

        if (lojista === true || lojista === false)
            lojista = lojista ? 'S' : 'N';

        if (id_carteira > 0)
            carteira = await this.repository.findCarteiraById(id_carteira);
        else if (id_user > 0)
            carteira = await this.repository.findCarteiraByUserId(id_user);

        if (!carteira)
            throw new CarteiraNotFoundError('A carteira não existe!');

        if (lojista && lojista != carteira.lojista)
            await this.repository.updateTypeCarteira({ id_user, id_carteira, lojista });

        if (saldo && saldo != carteira.saldo)
            await this.repository.updateBalanceCarteira({ id_user, id_carteira, saldo });

        let data: CarteiraProps | undefined;
        if (id_carteira > 0)
            data = await this.repository.findCarteiraById(id_carteira);
        else if (id_user > 0)
            data = await this.repository.findCarteiraByUserId(id_user);

        return {
            data,
            message: 'Carteira editada com sucesso!'
        };
    }
}