module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("user", {/*yaha nera define blog xa table name,,,tara database maa blogss banxa kinaki database maa sadhai plural maa hunxa database.*/
        senderId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        receiverId: {
            type: DataTypes.STRING,
            allowNull : false,
        },
        message : {
            type: DataTypes.STRING,
            allowNull : false,
        }
    });
    return User;
};