module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("user", {/*yaha nera define blog xa table name,,,tara database maa blogss banxa kinaki database maa sadhai plural maa hunxa database.*/
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            allowNull : false,
        },
        password: {
            type: DataTypes.TEXT,
            allowNull : false
        },
    });
    return User;
};