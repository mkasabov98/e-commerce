import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import bcrypt from "bcrypt";
import { UserRoles } from "../enums/user-enums.enum";

interface UserAttributes {
    id: number;
    email: string;
    password: string;
    role: UserRoles;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

export class User
    extends Model<UserAttributes, UserCreationAttributes>
    implements UserAttributes
{
    public id!: number;
    public email!: string;
    public password!: string;
    public role!: UserRoles;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public async checkPassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: UserRoles.User,
        },
    },
    {
        sequelize,
        tableName: "Users",
        modelName: "User",
    }
);

User.beforeCreate(async (user: User) => {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
});

User.beforeUpdate(async (user: User) => {
    if (user.changed("password")) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    }
});
