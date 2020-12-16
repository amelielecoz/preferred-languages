#!/usr/bin/env node

const axios = require("axios");


const getRepos = async(user) => {
    const repoListUrl = `https://api.github.com/users/${user}/repos`;
    const response = await axios.get(repoListUrl, { headers: { Accept: "application/json" }});
    response.data.map
    return response.data;
} 

const getLanguages = async(user, repos) => {
    let languages = [];
    for(let repo of repos) {
        const repoLanguageUrl = `https://api.github.com/repos/${user}/${repo.name}/languages`;
        const response = await axios.get(repoLanguageUrl, { headers: { Accept: "application/json" }});
        languages.push(response.data);
        console.log(response.data);
    }
    return languages;
}

const sumLanguages = languages => {
    let result = {};
    languages.forEach(entry => {
        Object.keys(entry).forEach(language => {
            let lines = entry[language];
            if(!result[language]) {
                result[language] = lines;
            } else {
                result[language] += lines;
            }
        });
    });

    
    //Trier les langages du plus utilisé au moins utilisé
    return result;
}

process.argv.slice(2).forEach(async(user) => {
    
    let result = {};
    try{
        // //Récupère la liste des repos
        const repos = await getRepos(user);

        // //Pour chaque repo, on récupère les infos de languages
        const languages = await getLanguages(user, repos);

        // //On résume les languages dans un seul objet result
        result = sumLanguages(languages);
        //Log l'output
        
    } catch(err) {
        console.log(err);
    }

    const sortedResult = Object.fromEntries(
        Object.entries(result).sort(([,a],[,b]) => b-a)
    );
    
    console.log(`Language repartition for ${user}`);

    Object.keys(sortedResult).forEach(language => {
        console.log(`* ${sortedResult[language]}: ${language}`);
    });
    
});

