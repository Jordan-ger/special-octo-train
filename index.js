const showavto = (str) => {
    const lines = str.trim().split('\n').slice(1);
    const data = lines.map((line) => line.split(','));
    //№1
    console.log(`Количество автомобилей: ${lines.length}`);
    //№2
    const totalafto = data.map((row) => Number(row[4]));
    const averageavdo = totalafto.reduce((acc, totalCount) => acc + totalCount, 0);
    const { length } = totalafto;
    const Milrange = averageavdo / length;
    console.log(`Средний пробег: ${Milrange}`);
    //№3
    const priceCar = data.map((row) => row[7]);
    const maxPriceCar = Math.max.apply(null, priceCar);
    console.log(`Стоимость самой дорогой машины: ${maxPriceCar}`);
    //№4
    const dataCars = data.map((row) => ({brand: row [0], model: row[1], year: Number(row[2])}));
    const nameCar = dataCars.reduce((min, car) => (car.year < min.year ? car : min));
    console.log(`Самый старый автомобиль: ${nameCar.brand} ${nameCar.model}`);

};
    
export default showavto;