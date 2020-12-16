#!/usr/bin/env node

const axios = require("axios");


const getRepos = async(user) => {
    const repoListUrl = `https://api.github.com/users/${user}/repos`;
    const repos = await axios.get(repoListUrl, { headers: { Accept: "application/json" }})
    return repos;
} 

const getLanguages = repos => {
    let languages = [];
    repos.foreach(async(repo) => {
        const repoLanguageUrl = `https://api.github.com/repos/${user}/${repo.name}/languages`;
        const language = await axios.get(repoLanguageUrl, { headers: { Accept: "application/json" }})
        languages.push(language);
    });
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
    
    try{
        // //Récupère la liste des repos
        const repos = await getRepos(user);
        // //Pour chaque repo, on récupère les infos de languages
        const languages = await getLanguages(repos);
        // //On résume les languages dans un seul objet result
        const result = await sumLanguages(languages);
        //Log l'output
        console.log(`Language repartition for ${user}`);
        Object.keys(result).forEach(language => {
            console.log(`* ${result[language]}: ${language}`);
        });
    } catch(err) {
        console.log(err);
    }
    
});

