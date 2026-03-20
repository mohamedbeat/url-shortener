import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createUser, User } from './entities/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async getUserById(id: string) {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) {
            throw new NotFoundException(`user with id ${id} not found`);
        }
        return user;
    }

    async validateGoogleUser(details: createUser) {
        let user = await this.userRepository.findOneBy({ email: details.email });

        if (!user) {
            user = this.userRepository.create(details);
            await this.userRepository.save(user);
            return user;
        }

        await this.updateChangedData(details, user);
        return user;
    }

    private async updateChangedData(details: createUser, user: User) {
        if (user.picture !== details.picture) {
            user.picture = details.picture;
        }
        if (user.firstName !== details.firstName) {
            user.firstName = details.firstName;
        }
        if (user.lastName !== details.lastName) {
            user.lastName = details.lastName;
        }
        await this.userRepository.save(user);
    }
}
